import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Clipboard from 'expo-clipboard'
import React, { useEffect, useState } from 'react'
import {
  Image,
  Pressable,
  Modal as ReactNativeModal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import sb from 'satoshi-bitcoin'

import { API, ITxResult } from '@/app/network/rpc'
import {
  computeAgreggateBalancesUSD,
  formatDollar,
  getAccounts,
  IAccounts,
  IWallet,
  Networks,
  syncWalletBalanceInMemory
} from '@/app/utils'

import { COLORS } from '@/app/COLORS'
import { IReceipt, triggerSendSuccesfulNotification } from '@/app/processes/Notifications'
import CloseScannerIcon from '@/components/CloseScannerIcon'
import { actuatedNormalize, actuatedNormalizeVertical } from '@/components/Dimension'
import DrawerBackIcon from '@/components/DrawerBackIcon'
import QRIcon from '@/components/QR'
import displayToast from '@/components/Toast'
import { updateTotalBalance } from '@/features/wallet/walletSlice'
import {
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts
} from '@expo-google-fonts/poppins'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import Modal from 'react-native-modal'
import { useDispatch } from 'react-redux'
import { debounce } from 'lodash'

interface ITransactionState {
  success?: boolean,
  title: string;
  message: string;
  icon: string;
}

interface ITransactionStates {
  confirm: ITransactionState,
  pending: ITransactionState;
  success: ITransactionState;
  fail: ITransactionState;
}

const transactionStates: ITransactionStates = {
  confirm: {
    title: 'Confirm',
    message: '',
    icon: require('@/assets/tx-confirm.png')
  },
  pending: {
    title: 'Please Wait',
    message: 'Transfer Progress. Please wait.',
    icon: require('@/assets/tx-wait.png')
  },
  success: {
    success: true,
    title: 'Transfer Success',
    message: '',
    icon: require('@/assets/tx-success.png')

  },

  fail: {
    title: 'Transfer  Failed',
    message: 'Transfer  Failed',
    icon: require('@/assets/tx-fail.png')
  }

}

interface IQRCodeScannerProps {
  visible: boolean
  onClose: () => void
  onScanned: (data: any) => void
}

const QRCodeScanner = ({ visible, onClose, onScanned }: IQRCodeScannerProps) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [scanned, setScanned] = useState(false)


  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])



  const handleBarCodeScanned = debounce(({ data }) => {
    setScanned(true)
    onScanned(data)
    onClose()
    setScanned(false);
  }, 1000)

  return (
    <View style={styles.container}>
      <ReactNativeModal
        style={{ flex: 1 }}
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: actuatedNormalizeVertical(44), justifyContent: 'center', alignContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

            <View style={{ paddingRight: actuatedNormalize(50) }}>
              <DrawerBackIcon onpress={onClose} />
            </View>
            <Text style={{ fontWeight: '600' }}>Scan QR code</Text>
          </View>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: actuatedNormalize(100) }}>
            <View style={styles.scannerContainer}>
              {hasPermission ? (

                <>
                  <BarCodeScanner
                    style={StyleSheet.absoluteFillObject}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                  />

                </>
              ) : (<Text>No access to camera</Text>)
              }
            </View>
          </View>
          <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: actuatedNormalizeVertical(60), paddingBottom: actuatedNormalizeVertical(98) }}>
            <CloseScannerIcon onPress={onClose} />
          </View>
        </View>
      </ReactNativeModal>
    </View>
  );
};

interface ITxSummary {
  from?: string,
  to?: string,
  amount: number,
  amountUSD: number,
  fee?: number,
  txId?: string,
  message?: string,
  timestamp: number
}

interface IRpcError {
  code: number;
  message: string;
}


interface RpcResult {
  error: IRpcError | null;
  id: string;
  result: any;
}

interface IApiResponse {
  balance: number;
  rpc_result: RpcResult;
  success: boolean;
  txHash: string | null;
}

async function getBGLPriceChange(): Promise<number | void> {
  try {
    const url = `https://3rdparty-apis.coinmarketcap.com/v1/cryptocurrency/widget?id=5667&convert_id=1,2781,2781`;
    const res = await fetch(url)
    const info = await res.json()
    const bglPrice = info.data['5667'].quote['2781'].price
    return bglPrice
  } catch (error) {
    displayToast({ message: 'Failed, please check network', type: 'info' })
  }
}

async function getBNBPriceUSD() {
  const BNB_DAO_PRICE_API = 'https://api.diadata.org/v1/assetQuotation/BinanceSmartChain/0x0000000000000000000000000000000000000000'

  try {
    const bnbPriceInfo = await fetch(BNB_DAO_PRICE_API)
    const bnbinfo = await bnbPriceInfo.json()
    return bnbinfo.Price
  } catch (error) {
    displayToast({ message: 'Failed, please check network', type: 'info' })
  }
}

async function getETHPriceUSD() {
  const ETH_DAO_PRICE_API = 'https://api.diadata.org/v1/assetQuotation/Ethereum/0x0000000000000000000000000000000000000000'

  try {
    const ethPriceInfo = await fetch(ETH_DAO_PRICE_API)
    const ethnfo = await ethPriceInfo.json()
    return ethnfo.Price
  } catch (error) {
    displayToast({ message: 'Failed, please check network', type: 'info' })
  }
}


async function getWBGLPriceUSD() {
  const WBGL_DAO_PRICE_API = 'https://api.diadata.org/v1/assetQuotation/Ethereum/0x2bA64EFB7A4Ec8983E22A49c81fa216AC33f383A'

  try {
    const wbglPriceInfo = await fetch(WBGL_DAO_PRICE_API)
    const wbglInfo = await wbglPriceInfo.json()
    return wbglInfo.Price
  } catch (error) {
    displayToast({ message: 'Failed, please check network', type: 'info' })
  }
}

function geUSDTPrice() {
  const USDT_DAO_PRICE = 1 // $1.00
  return USDT_DAO_PRICE
}

const Send = () => {
  const [feeFocus, setFeeFocus] = useState<boolean>(false)
  const [fee, setFee] = useState(0.000100)
  const [amount, setAmount] = useState<number>(0)
  const [recipientAddress, setRecepientAdress] = useState<string>('')
  const [balanceAfterSend, setBalanceAfterSend] = useState<number>()

  const [loading, setIsLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [txState, setTxState] = useState<ITransactionState>(transactionStates.confirm)
  const [txSummary, setTxSummary] = useState<ITxSummary | null>()
  const [rpcTxResult, setRPCtxResult] = useState<ITxResult>()
  const [addressFieldFocus, setIsAddressFieldFocused] = useState<boolean>(false)
  const [amountFieldFocus, setAmountFocus] = useState<boolean>(false)
  const [feeFieldfocus, setFeeFieldFocus] = useState<boolean>(false)
  const [confirmTransfer, setConfirmTransfer] = useState(false)

  const [bglPriceUSD, setBGLPriceUSD] = useState<number>(0.09246109718588248)
  const [ethPriceUSD, setEthPriceUSD] = useState<number>(2400)
  const [bnbPriceUSD, setBNBPriceUSD] = useState<number>(550)
  const [usdtPrice, setsusdtPrice] = useState(1)
  const [wbglPrice, setWBGLPrice] = useState(0.09246109718588248)
  const [barcodeModalOpen, setbarcodeModalOpen] = useState(false)

  const {
    detail,
    network,
    asset,
    privateKey,
    address,
    balance,
    balanceUSD
  } = useLocalSearchParams()

  const dispatch = useDispatch()

  const navigation = useNavigation()
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_700Bold
  })


  const setupHeaderTitle = (network: string, asset: string) => {
    if (asset === 'USDT') return `Send ${asset} ${network}`
    return `Send ${asset}`
  }
  useEffect(() => {

    navigation.setOptions({
      headerTitle: setupHeaderTitle(network, asset),
      headerTitleAlign: 'center',
      backBehavior: 'history',
      // goBack hack: goBack doesn't work: so we push previous route+initial params
      headerLeft: () => (
        <View style={{ marginLeft: actuatedNormalize(19) }}>
          <DrawerBackIcon onpress={() => router.push({
            pathname: 'asset-info',
            params: {
              network,
              asset,
              privateKey,
              address,
              balance,
              balanceUSD: balanceUSD
            }
          })} />
        </View>)
    });

    switch (asset) {
      case 'BGL':
        getBGLPriceChange()
          .then(res => {
            setBGLPriceUSD(res as number)
          })
        break;
      case 'BNB':
        getBNBPriceUSD()
          .then(res => {
            setBNBPriceUSD(res)
          })
        break;
      case 'USDT':
        setsusdtPrice(1)
        break;
      case 'ETH':
        getETHPriceUSD()
          .then(res => {
            setEthPriceUSD(res)
          })
        break;
      case 'WBGL': // handle individually using the network flag
        getWBGLPriceUSD()
          .then(res => {
            setWBGLPrice(res)
          })
        break;
      default:
        break;
    }
  }, [asset])

  // hook up global state- reactivity and responsivness- reflect balance changes, account changes in real time
  // txBuilder api call with authorization token
  // revisit fee
  // toast Logic: notification icon - modal

  const fetchClipboardContent = async () => {
    const text = await Clipboard.getStringAsync();
    return text
  }

  const handleSend = async () => {
    const apiInstance = new API()
    setTxState(transactionStates.pending)
    switch (asset) {
      case 'BGL':
        setTxSummary({
          // @ts-ignore
          amount: amount,
          // @ts-ignore
          amountUSD: formatDollar.format(amount * bglPriceUSD),

        })
        try {
          const txObject = {
            from: address,
            to: recipientAddress,
            privateKey: privateKey,
            amount: sb.toSatoshi(amount) + sb.toSatoshi(fee),
            fee: sb.toSatoshi(fee)
          }

          // @ts-ignore
          const res = await apiInstance.sendRawTransaction(txObject) as ITxResult
          if (res.success) {
            const { balance, balanceUSD: usd } = res

            const newAccountState: IWallet = {

              address: address as string,
              index: 0, // @todo: refactor this to use account HD index depth once fully supporting multiple accounts per network -send to/fro api to keep track
              balance: {
                usd: usd,
                balance: balance,
              },

              imported: true, // toggle on import
              active: true, // toggle value on select
              privateKey: privateKey as string,
              assets: {
                usdt: 0, // update this, remote the hardcoded zero values
                wbgl: 0, // update real values, avoid hardcode values
                // wbglUSD: 0 //
              }

            }

            await syncWalletBalanceInMemory(newAccountState, Networks.Bitgesell)
            const balanceComputed = await computeAgreggateBalancesUSD()
            dispatch(updateTotalBalance({ balance: balanceComputed?.totalBalanceUSD }))
            // @todo: fix state to read directly so the changes in individual tokens can be synced also.
            setTxState((_state) => {
              return {
                ..._state,
                ...transactionStates.success,
                message: `Successfully sent ${amount} ${asset} to ${address}. TxHash: ${res.txHash}. Transaction may take up to 10 minutes to be confirmed.`
              }
            })

            setTxSummary({
              from: txObject?.from,
              amount: txObject.amount,
              // @ts-ignore
              amountUSD: '',
              fee: txObject.fee,
              txId: res.txHash,
              timestamp: Date.now()
            })

            const receipt: IReceipt = {
              to: recipientAddress,
              tx_id: res.txHash,
              amount: amount,
              fee: res.fee,
              asset: asset,
              network: network as Networks,
              unconfirmed: true,
              coinbase: false
            }

            triggerSendSuccesfulNotification(asset, receipt)
          }

          if (!res.success) {
            setTxState(transactionStates.fail)
            setTxSummary({
              // @ts-ignore
              amount: amount,
              message: res.rpc_result.error,
              // @ts-ignore
              amountUSD: '',
              txId: res.rpc_result.result,
              timestamp: Date.now()
            })
          }

        } catch (error) {
          setTxSummary({
            // @ts-ignore
            message: error.message,

            // @ts-ignore
            amountUSD: '',
          })
          setTxState(transactionStates.fail)
          setIsModalVisible(true)
        }
        break;
      case 'BNB':
        try {
          const txObject = {
            privateKey: privateKey as string,
            amount: amount,
            to: recipientAddress,
          }
          const res = await apiInstance.sendBNB(txObject)

          if (res.success) {
            const { balance } = res

            const newAccountState: IWallet = {

              address: address as string,
              index: 0,
              balance: {
                usd: Number(balance) * bnbPriceUSD,
                balance: Number(balance),
              },

              imported: true,
              active: true,
              privateKey: privateKey as string,
              assets: {
                usdt: 0,
                wbgl: 0,
              }
            }

            await syncWalletBalanceInMemory(newAccountState, Networks.BNBSmartChain)
            const balanceComputed = await computeAgreggateBalancesUSD()
            dispatch(updateTotalBalance({ balance: balanceComputed?.totalBalanceUSD }))
            setTxState((_state) => {
              return {
                ..._state,
                ...transactionStates.success,
                message: `Successfully sent ${amount} ${asset} to ${address}. TxHash: ${res.transactionHash}. Transaction may take up to 10 minutes to be confirmed. A fee of ${res.feePercentage} is applied on all transfers.`
              }
            })

            setTxSummary({
              from: txObject?.from,
              amount: txObject.amount,
              // @ts-ignore
              amountUSD: res.amountUSD,
              fee: txObject.fee,
              txId: res.transactionHash,
              timestamp: Date.now()
            })

            const receipt: IReceipt = {
              to: recipientAddress,
              tx_id: res.transactionHash,
              amount: amount,
              fee: res.fee,
              asset: asset,
              network: network as Networks,
              unconfirmed: true,
              coinbase: false
            }

            triggerSendSuccesfulNotification(asset, receipt)

          }

          if (!res.success) {
            setTxState(transactionStates.fail)
            setTxSummary({
              // @ts-ignore
              amount: amount,
              message: res.error,
              // @ts-ignore
              amountUSD: '',
              txId: null,
              timestamp: Date.now()
            })
            setTxState((_txState) => {
              return {
                ..._txState,
                message: `Failed: ${res.msg}`
              }
            })
          }
        } catch (error) {
          setTxSummary({
            // @ts-ignore
            message: `$Failed: ${error}`,

            // @ts-ignore
            amountUSD: '',
          })
          setTxState((_txState) => {
            return {
              ..._txState,
              message: `Failed: ${error}`
            }
          })
          setTxState(transactionStates.fail)
          setIsModalVisible(true)
          setTxState(transactionStates.pending)
          displayToast({ message: `Failed: ${error}`, type: 'error' })
        }
        break;

      case 'ETH':
        try {
          const txObject = {
            privateKey: privateKey as string,
            amount: amount,
            to: recipientAddress,
          }
          const res = await apiInstance.sendETH(txObject)

          if (res.success) {
            const balance = await apiInstance.getETHBalance(privateKey as string)
            const accounts = await getAccounts(Networks.Ethereum) as IAccounts
            const wallet = accounts.accounts[0]

            const newAccountState: IWallet = {
              address: address as string,
              index: 0,
              balance: {
                usd: balance.balance.usd,
                balance: balance.balance.balance,
              },

              imported: true,
              active: true,
              privateKey: privateKey as string,
              assets: {
                usdt: wallet.assets.usdt,
                wbgl: wallet.assets.wbgl,
              }
            }

            await syncWalletBalanceInMemory(newAccountState, Networks.Ethereum)
            const balanceComputed = await computeAgreggateBalancesUSD()
            dispatch(updateTotalBalance({ balance: balanceComputed?.totalBalanceUSD }))
            setTxState((_state) => {
              return {
                ..._state,
                ...transactionStates.success,
                message: `Successfully sent ${amount} ${asset} to ${address}. TxHash: ${res.transactionHash}. Transaction may take up to 10 minutes to be confirmed.`
              }
            })

            setTxSummary({
              from: txObject?.from,
              amount: txObject.amount,
              // @ts-ignore
              amountUSD: res.amountUSD,
              fee: txObject.fee,
              txId: res.transactionHash,
              timestamp: Date.now()
            })

            const receipt: IReceipt = {
              to: recipientAddress,
              tx_id: res.transactionHash,
              amount: amount,
              fee: res.fee,
              asset: asset,
              network: network as Networks,
              unconfirmed: true,
              coinbase: false
            }

            triggerSendSuccesfulNotification(asset, receipt)
          }

          if (!res.success) {
            setTxState(transactionStates.fail)
            displayToast({ message: `${res.error}`, type: 'error' })

            setTxSummary({
              // @ts-ignore
              amount: amount,
              message: res.error,
              // @ts-ignore
              amountUSD: '',
              txId: null,
              timestamp: Date.now()
            })
            setTxState((_txState) => {
              return {
                ..._txState,
                message: `Failed: ${res.error}`
              }
            })
          }
        } catch (error) {
          setTxSummary({
            // @ts-ignore
            message: `$Failed: ${error}`,

            // @ts-ignore
            amountUSD: '',
          })
          setTxState((_txState) => {
            return {
              ..._txState,
              message: `Failed: ${error}`
            }
          })
          setTxState(transactionStates.fail)
          setIsModalVisible(true)
          displayToast({ message: `Failed: ${error}`, type: 'error' })
        }
        break;
      case 'USDT':
        // handle based on network  
        try {
          const txObject = {
            privateKey: privateKey as string,
            amount: amount,
            to: recipientAddress,
          }
          const res = await apiInstance.sendUSDT(txObject, network as Networks)

          if (res.success) {
            const balance = await apiInstance.getUSDTBalance(address)
            const accounts = await getAccounts(Networks.Ethereum) as IAccounts
            const wallet = accounts.accounts[0]

            const newAccountState: IWallet = {
              ...wallet,
              address: address as string,
              index: 0,
              imported: true,
              active: true,
              privateKey: privateKey as string,
              assets: {
                usdt: balance.balance.usd,
                wbgl: wallet.assets.wbgl,
              }
            }

            await syncWalletBalanceInMemory(newAccountState, network as Networks)
            const balanceComputed = await computeAgreggateBalancesUSD()
            dispatch(updateTotalBalance({ balance: balanceComputed?.totalBalanceUSD }))
            setTxState((_state) => {
              return {
                ..._state,
                ...transactionStates.success,
                message: `Successfully sent ${amount} ${asset} to ${address}. TxHash: ${res.txHash}. Transaction may take up to 10 minutes to be confirmed.`
              }
            })

            setTxSummary({
              from: txObject?.from,
              amount: txObject.amount,
              // @ts-ignore
              amountUSD: res.amountUSD,
              fee: txObject.fee,
              txId: res.txHash,
              timestamp: Date.now()
            })

            const receipt: IReceipt = {
              to: recipientAddress,
              tx_id: res.txHash,
              amount: amount,
              fee: res.fee,
              asset: asset,
              network: network as Networks,
              unconfirmed: true,
              coinbase: false
            }

            triggerSendSuccesfulNotification(asset, receipt)

          }

          if (!res.success) {
            setTxState(transactionStates.fail)
            displayToast({ message: `${res.error}`, type: 'error' })

            setTxSummary({
              // @ts-ignore
              amount: amount,
              message: res.error,
              // @ts-ignore
              amountUSD: '',
              txId: null,
              timestamp: Date.now()
            })
            setTxState((_txState) => {
              return {
                ..._txState,
                message: `Failed: ${res.error}`
              }
            })
          }
        } catch (error) {
          setTxSummary({
            // @ts-ignore
            message: `$Failed: ${error}`,

            // @ts-ignore
            amountUSD: '',
          })
          setTxState((_txState) => {
            return {
              ..._txState,
              message: `Failed: ${error}`
            }
          })
          setTxState(transactionStates.fail)
          setIsModalVisible(true)
          displayToast({ message: `Failed: ${error}`, type: 'error' })
        }
        break;
    }
  }


  return (
    <ScrollView style={styles.sendContainer}>
      <View>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: actuatedNormalize(10) }}>
            <Text style={styles.fieldLabel}>To</Text>
            <View>
              <QRIcon onPress={() => setbarcodeModalOpen(true)} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: actuatedNormalizeVertical(23) }}>
            <TextInput
              style={[styles.addressInput, { borderColor: addressFieldFocus ? COLORS.ACCENT : COLORS.WHITE004 }]}
              textContentType='password'
              autoCorrect={false}
              clearTextOnFocus={true}
              placeholder={`Recepient ${asset} address`}
              onFocus={() => {
                setIsAddressFieldFocused(true)
              }}
              onBlur={() => setIsAddressFieldFocused(false)}
              onChangeText={(text) => {
                setRecepientAdress(text)
              }}
              value={recipientAddress}
            />
            {recipientAddress == '' ? (
              <Pressable

                onPress={() => {
                  fetchClipboardContent().then(text => {
                    setRecepientAdress(text)
                    displayToast({ message: `Pasted ${text}!`, type: 'info' })
                  })
                }}
                style={{ marginLeft: actuatedNormalize(-60), marginRight: actuatedNormalize(7), zIndex: 1000, overflow: 'hidden' }}>
                <Text style={{ fontWeight: 'bold', color: COLORS.ACCENT }}>Paste</Text>
              </Pressable>
            ) : null}

          </View>

        </View>
        <View style={{ marginTop: actuatedNormalizeVertical(23) }}>
          <Text style={styles.fieldLabel}>Amount</Text>
          <TextInput
            style={[styles.addressInput, { borderColor: amountFieldFocus ? COLORS.ACCENT : COLORS.WHITE004 }]}
            textContentType='password'
            autoCorrect={false}
            clearTextOnFocus={true}
            keyboardType='numeric'
            placeholder={`Enter ${asset} amount to send`}
            onFocus={() => {
              setAmountFocus(true)
            }}
            onBlur={() => setAmountFocus(false)}
            onChangeText={(text) => {
              setAmount(Number(text))
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
            <Text style={styles.fieldInfoLabel}>Balance <Text>{balance} {asset}</Text></Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
            <Text style={styles.fieldInfoLabel}> {formatDollar.format(Number(balanceUSD))}</Text>
          </View>
        </View>

        {asset === 'BGL' ? (
          <View style={{ marginTop: actuatedNormalizeVertical(23) }}>
            <Text style={styles.fieldLabel}>Fee</Text>
            <TextInput
              style={[styles.addressInput, { borderColor: feeFieldfocus ? COLORS.ACCENT : COLORS.WHITE004 }]}
              textContentType='password'
              autoCorrect={false}
              keyboardType='numeric'
              clearTextOnFocus={false}
              value={String(fee)}
              onFocus={() => {
                setFeeFieldFocus(true)
              }}
              onBlur={() => setFeeFieldFocus(false)}
              onChangeText={(text) => {
                setFee(Number(text))
              }}
              placeholder={String(fee)}
              placeholderTextColor={COLORS.WHITE004}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
              <Text style={styles.fieldInfoLabel}>Default Fee of {fee}BGL</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
              <Text style={styles.fieldInfoLabel}>If unsure, leave fee field with the current default value.</Text>
            </View>
          </View>
        ) : null
        }

        <View style={{ marginTop: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            disabled={recipientAddress === '' || amount === 0}

            onPress={() => {
              setIsModalVisible(true)
              setTxState((_txState) => {
                return {
                  ..._txState,
                  title: transactionStates.confirm.title,
                  icon: transactionStates.confirm.icon,
                  message: `Please confirm sending ${amount} ${asset} to ${recipientAddress}. Confirm that recipient address is correct. Funds sent to wrong address are irreversible and irretrievable.`
                }

              })
            }}
            style={{
              opacity: recipientAddress === '' || amount === 0 ? 0.6 : 1,
              height: actuatedNormalize(50),
              width: actuatedNormalize(335),
              backgroundColor: COLORS.ACCENT,
              borderRadius: actuatedNormalize(11),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            {amount > 0 ? (
              <Text style={[styles.buttonLabelText, { fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }]}> Send {amount} {asset}</Text>
            ) : (
              <Text style={[styles.buttonLabelText, { fontFamily: 'Poppins_600SemiBold' }]}>
                Send {asset}
              </Text>
            )

            }
          </Pressable>
          {/* Modal */}
          <Modal isVisible={isModalVisible}>
            <View style={styles.modalViewRoot}>
              <View style={styles.modalView}>
                <View style={styles.animatedImageContainer}>
                  <Image
                    source={txState.icon}
                    style={{ height: actuatedNormalize(45), width: actuatedNormalize(45) }}
                  />
                </View>
                <View style={styles.messageContainer}>
                  <Text style={[styles.messageTitle, { fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }]}>
                    {txState.title}
                  </Text>
                  <Text style={[styles.messageText]}>
                    {txState.message}
                  </Text>
                </View>
                <View>

                </View>
                <View style={styles.actionButtonContainer}>
                  {txState.title === 'Confirm' ? (
                    <View>
                      <Pressable

                        style={[styles.actionButtton, { backgroundColor: COLORS.ACCENT }]}
                        onPress={() => {
                          // setIsModalVisible(false)
                          setConfirmTransfer(true)
                          handleSend()
                        }}
                      >
                        <Text style={{ color: COLORS.WHITE, fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>Confirm</Text>
                      </Pressable>
                      <Pressable

                        style={[styles.actionButtton, { marginTop: actuatedNormalizeVertical(20) }]}
                        onPress={() => {
                          setIsModalVisible(false)
                        }}
                      >
                        <Text style={{ color: COLORS.WHITE, fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>Back</Text>
                      </Pressable>
                    </View>

                  ) : (
                    <Pressable
                      style={styles.actionButtton}
                      onPress={() => {
                        setIsModalVisible(false)
                      }}
                    >
                      <Text style={{ color: COLORS.WHITE, fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>Back</Text>
                    </Pressable>
                  )}

                  {txState.title === 'Transfer Success' ? (
                    <View style={{ marginTop: actuatedNormalizeVertical(15) }}>
                      <Pressable
                        style={[styles.actionButtton, { backgroundColor: COLORS.ACCENT }]}
                        onPress={() => {
                          setIsModalVisible(false)
                          router.push({
                            params: {
                              tx_id: txSummary?.txId,
                              to: recipientAddress,
                              amount: asset === 'BGL' ? sb.toBitcoin(txSummary?.amount) : txSummary?.amount,
                              asset: asset,
                              network: network,
                              unconfirmed: true,
                              fee: fee,
                              coinbase: false
                            },
                            pathname: '/(tabs)/transaction-summary'
                          })
                        }}
                      >
                        <Text style={{ color: COLORS.WHITE, fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>View Summary</Text>
                      </Pressable>
                    </View>
                  ) : null
                  }
                </View>
              </View>
            </View>
          </Modal>
          <QRCodeScanner onClose={() => setbarcodeModalOpen((open) => !open)} visible={barcodeModalOpen} onScanned={(data) => { setRecepientAdress(data) }} />
        </View>
      </View>
    </ScrollView >
  )

}

export default Send

const styles = StyleSheet.create({
  sendContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: actuatedNormalize(20)
  },
  fieldLabel: {
    fontWeight: '600',
    paddingBottom: actuatedNormalizeVertical(5)
  },
  sendHeadingText: {
    fontSize: 18,
    fontWeight: '600'
  },
  addressInput: {
    width: '100%',
    fontSize: actuatedNormalize(16),
    height: actuatedNormalizeVertical(50),
    borderStyle: 'solid',
    borderWidth: 1,
    paddingStart: actuatedNormalize(20),
    borderRadius: actuatedNormalize(7),
  },
  fieldInfoLabel: {
    fontSize: actuatedNormalize(14),
    color: '#AAAAAA'
  },
  buttonLabelText: {
    color: COLORS.WHITE,
    fontWeight: '600'
  },
  modalViewRoot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: actuatedNormalize(30),
    paddingTop: actuatedNormalizeVertical(10),
    paddingEnd: actuatedNormalize(20),
    paddingStart: actuatedNormalize(20),
    width: actuatedNormalize(335),
    height: actuatedNormalizeVertical(460),
    backgroundColor: COLORS.WHITE
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  animatedImageContainer: {
    alignItems: 'center'
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: actuatedNormalizeVertical(17)
  },
  actionButtonContainer: {
    alignItems: 'center'
  },
  messageTitle: {
    color: COLORS.BLACK,
    paddingBottom: actuatedNormalizeVertical(4),
    paddingLeft: actuatedNormalize(14),
    paddingRight: actuatedNormalize(14),
    fontSize: actuatedNormalize(18)
  },
  messageText: {
    fontSize: actuatedNormalize(16),
    paddingBottom: actuatedNormalizeVertical(26)
  },
  actionButtton: {
    width: actuatedNormalize(240),
    height: actuatedNormalizeVertical(50),
    borderRadius: actuatedNormalize(11),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK_ACCENT
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: actuatedNormalizeVertical(50),
    borderRadius: actuatedNormalize(11),
    backgroundColor: COLORS.BLACK_ACCENT,
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: actuatedNormalize(16),
    fontWeight: '600'
  },
  submitButtonContainer: {
    // marginTop: 158
    width: '100%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  scannerContainer: {
    width: actuatedNormalize(300), // Desired width
    height: actuatedNormalize(300),
    // borderRadius: 10, // Optional: Add rounded corners
    flexDirection: 'row',
    // borderWidth: .3,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'lime',
  },
})