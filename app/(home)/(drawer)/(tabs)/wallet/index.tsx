
import { COLORS } from '@/app/COLORS'
import {
  CURRENT_ACCOUNT,
  SET_DEFAULT_NETWORK
} from '@/app/storage/keys'
import { saveItem } from '@/app/storage/saveItem'
import {
  BGLAccount,
  copyToClipboard,
  formatAddressForDisplay,
  formatDollar,
  getAccounts,
  getCurrentAccount,
  getItem,
  IAccounts,
  IWallet,
  Networks,
  saveAccounts,
  setCurrentAccountInStorage,
  supportedNetworks
} from '@/app/utils'
import {
  actuatedNormalize,
  actuatedNormalizeVertical
} from '@/components/Dimension'
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts
} from '@expo-google-fonts/poppins'
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Modal from 'react-native-modal'
import { RadioButton } from 'react-native-radio-buttons-group'
import { useSelector } from 'react-redux'

// @ts-ignore
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView
} from '@gorhom/bottom-sheet'

import { syncAllBalances } from '@/app/processes/balanceBackground'
import displayToast from '@/components/Toast'
import { useRouter } from 'expo-router'
import { API } from '@/app/network/rpc'
import { Tx } from '@/app/types'
import { ICONS, truncateHash } from '../transaction-history'

// send - all networks
// txHistory- all networks
// Share address- support all networks
// Home- all networks
export interface INetwork {
  id: string
  icon: string
  name: string
}

const networsSelectIds = {
  Bitgesell: '1',
  BinanceSmartChain: '2',
  Ethereum: '3',
}

interface IAccountContainerProps {
  address: string,
  index: number,
  selectedAddress: string,
  balanceUSD: number
  onPress: () => Promise<undefined>
  handleStyleOnpress: () => void
  balance: number,
  icon: string,
  network: string
}


type IAssetProps = {
  onPress: () => void
  networkName: string
  balanceUSD: number
  balance: number,
  name: string
  address: string
  privateKey: string
}

type IAssetLogoProps = {
  networkName: Networks | 'Bitgesell' | 'Ethereum' | 'BNBSmartchain'
}

const renderAssetLogo = ({
  networkName
}: IAssetLogoProps) => {
  switch (networkName) {
    case Networks.Bitgesell:
      return (<Image style={{ height: actuatedNormalize(61), width: actuatedNormalize(61), marginRight: actuatedNormalize(14) }} source={require('@/assets/bgl-network.png')} />)
    case Networks.Ethereum:
      return (<Image style={{ height: actuatedNormalize(61), width: actuatedNormalize(61), marginRight: actuatedNormalize(14) }} source={require('@/assets/ethereum-network.png')} />)
    case Networks.BNBSmartChain:
      return (<Image style={{ height: actuatedNormalize(61), width: actuatedNormalize(61), marginRight: actuatedNormalize(14) }} source={require('@/assets/bnb-chain.png')} />)
    default:
      break
  }
}


const getSelectIds = (nework: Networks) => {
  switch (nework) {
    case Networks.Bitgesell:
      return networsSelectIds.Bitgesell
    case Networks.BNBSmartChain:
      return networsSelectIds.BinanceSmartChain
    case Networks.Ethereum:
      return networsSelectIds.Ethereum
    default:
      break;
  }
}

export const formatAssetLabels = (
  network: string,
) => {
  switch (network) {
    case 'Bitgesell':
      return 'BGL'
    case 'BNBSmartChain':
      return 'BNB'
    case 'Ethereum':
      return 'ETH'
    default:
      break;
  }
}

const AccountContainer = ({
  address,
  index,
  balance,
  balanceUSD,
  handleStyleOnpress,
  onPress,
  icon,
  selectedAddress,
  network
}: IAccountContainerProps) => {
  const [pressed, setPressed] = useState(false)

  async function getSetAccount() {
    const account = await getItem(CURRENT_ACCOUNT)
    return account
  }

  useEffect(() => {
    async function getDefaultAccount() {
      const account = await getItem(CURRENT_ACCOUNT) as IWallet
      setPressed(account.address === address)
    }

    return () => { }
  },
    //eslint-disable-next-line
    []);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={async () => {
        const account = await getSetAccount() as IWallet
        setPressed(account.address === address)

      }}
      style={{
        maxWidth: '100%',
        marginTop: actuatedNormalizeVertical(12),
        marginBottom: actuatedNormalizeVertical(12),
        height: actuatedNormalizeVertical(89),
        borderLeftWidth: pressed ? actuatedNormalize(5) : 0,
        borderLeftColor: pressed ? COLORS.ACCENT : COLORS.WHITE,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: pressed ? 'rgba(255, 186, 10, 0.2)' : COLORS.WHITE,
        width: '100%'
      }}>
      <View>
        <View style={{
          flexDirection: 'row',
          width: '100%',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'space-evenly'

        }}>
          <View
            style={{
              borderRadius: actuatedNormalize(25.5),
              borderWidth: 1,
              borderColor: pressed ? COLORS.WHITE : COLORS.ACCENT,
              backgroundColor: COLORS.WHITE,
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              height: actuatedNormalizeVertical(53),
              width: actuatedNormalize(53)
            }}
          >
            {renderAssetLogo({ networkName: network })}
          </View>

          <View>
            <Text>
              Account {index}
            </Text>
            <Text>
              {formatAddressForDisplay(address)}
            </Text>
          </View>

          <View>
            <Text>
              {formatDollar.format(balanceUSD)}
            </Text>
            <Text>
              {balance} {formatAssetLabels(network)}
            </Text>
          </View>

        </View>

      </View>
    </Pressable >

  )
}


const Wallet = () => {
  // @ts-ignore
  const dashboardInfo = useSelector(state => state.wallet.dashboard) // retrieve from sqlite db at store level?
  // display a loader as we populate fetch global state
  const [loading, setloading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedId, setSelectedId] = useState<string>()

  const [selectedNetworkName, setSelectedNetworkName] = useState<Networks>()
  const [network, setNetwork] = useState<INetwork>()

  const [accounts, setAccounts] = useState<IAccounts>()
  const [account, setAccount] = useState<IWallet>()
  const [copied, setCopied] = useState<boolean>(false)
  const [loadingAccounts, setloadingAccounts] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(true)

  const [totalBalance, setTotalBalance] = useState<number>(0)

  const [data, setData] = useState<Array<IWallet>>()


  const {
    detail,
    network: _network,
    asset,
    privateKey,
    address,
    balance,
    balanceUSD
  } = useLocalSearchParams()

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_700Bold
  })

  const router = useRouter()

  const navigation = useNavigation()

  useEffect(() => {
    syncAllBalances()
    const loadNetworkState = async (_networkName?: Networks) => {
      setloading(true)
      syncAllBalances()

      let defaultNetwork
      if (_network) defaultNetwork = { network: _networkName }
      else defaultNetwork = await getItem(SET_DEFAULT_NETWORK)

      setSelectedNetworkName(defaultNetwork.network)
      // @ts-ignore
      const network = supportedNetworks[defaultNetwork.network]
      setNetwork(network)
      const networkId = getSelectIds(defaultNetwork.network)
      const network_id = await getItem('network_id')
      const accounts = await getAccounts(defaultNetwork.network) as IAccounts
      return { accounts: accounts.accounts, network, networkId }
    }
    if (_network) {
      syncAllBalances()
      loadNetworkState(_network).then((result) => {
        setAccounts(result.accounts)
        setData(result.accounts)
        setAccount(result.accounts[0])
        setloading(false)
        setloadingAccounts(false)
        setSelectedId(result.networkId)
        const accounts = result.accounts
        let balanceUSDT = 0
        if (network === Networks.BNBSmartChain || network === Networks.Ethereum) {
          balanceUSDT = accounts[0].assets.usdt
        }
        const totalBalance = accounts[0].balance.usd + balanceUSDT
        setTotalBalance(totalBalance)
      }).catch(err => { return })

    } else {
      loadNetworkState().then((result) => {
        syncAllBalances()
        setAccounts(result.accounts)
        setData(result.accounts)
        setAccount(result.accounts[0])
        setloading(false)
        setloadingAccounts(false)
        setSelectedId(result.networkId)
        const accounts = result.accounts
        let balanceUSDT = 0
        if (network === Networks.BNBSmartChain || network === Networks.Ethereum) {
          balanceUSDT = accounts[0].assets.usdt
        }
        const totalBalance = accounts[0].balance.usd + balanceUSDT
        setTotalBalance(totalBalance)
      }).catch(err => { return })

    }
    setRefreshing(false)
  }, [network, navigator, asset])



  const handleNetworkSwitch = async () => {

    // @ts-ignore
    const networkDetails = supportedNetworks[selectedNetworkName]
    await saveItem({ data: JSON.stringify({ id: selectedId, }), key: 'network_id' })

    setNetwork(networkDetails)
    saveItem({ data: JSON.stringify({ network: networkDetails.name }), key: SET_DEFAULT_NETWORK })
    const accounts = await getAccounts(networkDetails.name) as IAccounts
    setData(accounts.accounts)
    const balance = accounts.accounts[0].balance.usd
    let balanceUSDT = 0
    if (networkDetails.name == Networks.BNBSmartChain || networkDetails.name == Networks.Ethereum) {
      balanceUSDT = accounts.accounts[0].assets.usdt
    }
    const totalBalance = balance + balanceUSDT
    saveAccounts(networkDetails.name, accounts)

    // @ts-ignore
    setAccounts(accounts.accounts)
    setTotalBalance(totalBalance)
  }


  const handleAccountSwitch = async (
    account: IWallet
  ) => {

    setAccount(account)
    await setCurrentAccountInStorage(account) // dispatch via store/gobal state for realtime
  }


  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    return
  }, [])

  const renderItem = useCallback((item: IWallet) => (
    <AccountContainer
      handleStyleOnpress={() => undefined}
      onPress={async () => { await handleAccountSwitch(item) }}
      key={item.index}
      selectedAddress={account?.address}
      address={item.address}
      index={item.index}
      balanceUSD={item.balance.usd}
      balance={item.balance.balance}
      // icon={network?.icon}
      network={network?.name} />
  ),
    [network]
  );

  const renderAsset = (
    {
      networkName,
      balanceUSD,
      balance,
      onPress,
      name,
      address,
      privateKey
    }: IAssetProps
  ) => {

    return (
      <Pressable
        onPress={() => {

          router.push({
            params: {
              network: network?.name,
              asset: name,
              privateKey: privateKey,
              address: address,
              balance: balance,
              balanceUSD: balanceUSD
            },
            pathname: 'asset-info'
          })
        }}
        style={{ width: '100%', backgroundColor: '#F5F5F5', height: actuatedNormalize(85), borderRadius: actuatedNormalize(15), paddingTop: actuatedNormalizeVertical(20), padding: actuatedNormalize(28), flexDirection: 'row', justifyContent: 'space-between', marginBottom: actuatedNormalize(15) }}>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {renderAssetLogo({ networkName })}
          <View>
            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>{formatAssetLabels(networkName)}</Text>
            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{balance.toFixed(4)}{formatAssetLabels(networkName)}</Text>
          </View>
        </View>
        <View>
          <View>
            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>{formatDollar.format(balanceUSD)}</Text>
            {/* <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{formatAssetLabels(networkName)}</Text> */}
          </View>
        </View>

      </Pressable>

    )
  }

  function onRefresh(): void {
    syncAllBalances()
      .then(() => setRefreshing(false))
  }

  // main screen
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.WHITE }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={styles.walletContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <View style={styles.switchNetworkContainer}>
              <Pressable
                onPress={() => {
                  setIsModalVisible(true)
                }}
                style={styles.networkPicker}>
                <Pressable onPress={() => {
                  setIsModalVisible(true)
                }}>
                  <Image
                    style={[styles.networkIcon, { height: network.name === Networks.Ethereum ? actuatedNormalizeVertical(25) : styles.networkIcon.height, width: network.name === Networks.Ethereum ? actuatedNormalize(18) : styles.networkIcon.width }]}
                    source={network.icon}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    setIsModalVisible(true)
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '500'
                    }}
                    onPress={() => {
                      setIsModalVisible(true)
                    }}
                  >
                    Switch Network
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setIsModalVisible(true)
                  }}
                >
                  <Image
                    style={{ height: actuatedNormalizeVertical(30), width: actuatedNormalize(30) }}
                    source={require('@/assets/down.png')}
                  />
                </Pressable>
              </Pressable>
            </View >

            <View style={styles.accountContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: actuatedNormalize(25) }}>
                <View>
                  <Image
                    style={{
                      height: actuatedNormalizeVertical(45),
                      width: actuatedNormalize(45)
                    }}
                    source={require('@/assets/identicon.png')} />
                </View>
                <Text
                  onPress={() => {
                    // setIsModalVisible(true)
                    // bottomSheetModalRef.current?.present()
                  }}
                  style={{ fontSize: actuatedNormalize(16), fontWeight: '600', fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>
                  Account {account?.index}
                </Text>
              </View>
              <View
                style={{ borderTopColor: COLORS.ACCENT, borderTopWidth: 1, paddingLeft: actuatedNormalize(25), marginTop: actuatedNormalize(11) }}>
                <View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'baseline', marginTop: actuatedNormalizeVertical(20) }}>

                    <Pressable style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: actuatedNormalizeVertical(28),
                      backgroundColor: 'rgba(255, 186, 10, 0.21)',
                      borderRadius: actuatedNormalize(10),
                      paddingLeft: actuatedNormalize(11),
                      paddingRight: actuatedNormalize(11),
                    }}>
                      <Text
                        style={{ color: COLORS.ACCENT }}>
                        {formatAddressForDisplay(account?.address)}
                      </Text>

                    </Pressable>
                    <Pressable

                      onPress={() => {
                        copyToClipboard(account?.address)
                        setCopied(true)
                        displayToast({ message: 'Copied address to clipboard!', type: 'info' })

                      }}
                      onPressOut={() => {
                        setTimeout(() => {
                          setCopied(false)
                        }, 5 * 1000)
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: COLORS.ACCENT
                        }}
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </Text>
                    </Pressable>

                  </View>
                </View>
              </View>

            </View>

            <View style={styles.assetContainer}>
              <View>
                <View
                  style={{ borderBottomColor: COLORS.ACCENT, borderBottomWidth: 3, justifyContent: 'center', alignItems: 'center', width: actuatedNormalize(116) }}>
                  <Text
                    style={{
                      fontSize: actuatedNormalize(16),
                      color: COLORS.ACCENT,
                      fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '',
                    }}
                  >
                    Assets
                  </Text>
                </View>
                <View style={{ paddingTop: actuatedNormalizeVertical(22) }}>
                  <Text style={{ fontSize: actuatedNormalize(32), paddingBottom: actuatedNormalize(20) }}>{formatDollar.format(totalBalance)}</Text>
                  {renderAsset({ networkName: network?.name, name: formatAssetLabels(network?.name), balanceUSD: account?.balance.usd, balance: account?.balance.balance, privateKey: account?.privateKey, address: account?.address })}
                  {
                    account?.assets ? (<>

                      {/* WBGL */}
                      {/* <Pressable
                        onPress={() => {
                          router.push({
                            params: {
                              network: network?.name,
                              asset: 'WBGL',
                              privateKey: account.privateKey,
                              address: account.address,
                              // from view wallet-adapt with params so all work cohesively
                              balance: account.assets.wbgl,
                            },
                            pathname: 'asset-info'
                          })
                        }}
                        style={{ width: '100%', backgroundColor: '#F5F5F5', height: actuatedNormalize(85), borderRadius: actuatedNormalize(15), paddingTop: actuatedNormalizeVertical(20), padding: actuatedNormalize(28), flexDirection: 'row', justifyContent: 'space-between', marginBottom: actuatedNormalize(15) }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image style={{ height: actuatedNormalizeVertical(60), marginRight: actuatedNormalize(14), width: actuatedNormalize(60), borderRadius: actuatedNormalize(30) }} source={require('@/assets/wbgl.png')} />
                          <View>
                            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>WrappedBGL</Text>
                            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{account.assets.wbgl}WBGL</Text>
                          </View>
                        </View>
                        <View>
                          <View>
                            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>{formatDollar.format(account.assets.wbgl * 0.0056)}</Text>
                          </View>
                        </View>
                      </Pressable> */}

                      {/* USDT */}
                      <Pressable
                        onPress={() => {
                          router.push({
                            params: {
                              network: network?.name,
                              asset: 'USDT',
                              privateKey: account.privateKey,
                              address: account.address,
                              balance: account.assets.usdt,
                              balanceUSD: account.assets.usdt
                            },
                            pathname: 'asset-info'
                          })
                        }}
                        style={{ width: '100%', backgroundColor: '#F5F5F5', height: actuatedNormalize(85), borderRadius: actuatedNormalize(15), paddingTop: actuatedNormalizeVertical(20), padding: actuatedNormalize(28), flexDirection: 'row', justifyContent: 'space-between', marginBottom: actuatedNormalize(15) }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image style={{ height: actuatedNormalizeVertical(60), width: actuatedNormalize(60), marginRight: actuatedNormalize(14), borderRadius: actuatedNormalize(30) }} source={require('@/assets/tether-sm.png')} />
                          <View>
                            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>Tether</Text>
                            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{account.assets.usdt}USDT</Text>
                          </View>
                        </View>
                        <View>
                          <View>
                            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>{formatDollar.format(account.assets.usdt)}</Text>
                            {/* <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>WBGL</Text> */}
                          </View>
                        </View>
                      </Pressable>
                    </>) : null
                  }
                </View>
              </View>
            </View>
          </>
        )}

        {/* Modal */}
        <Modal
          isVisible={isModalVisible}>
          <View
            style={styles.networkPickerModal}
          >
            <View style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text
                style={{
                  fontSize: actuatedNormalize(18),
                  fontWeight: '600',
                  fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : ''
                }}
              >
                Select Network
              </Text>
              <View style={{ width: '100%' }}>
                <View style={styles.networkItemContainer}>
                  <Image
                    style={styles.selectNetworkIcons}
                    source={supportedNetworks.Bitgesell.icon} />
                  <Text
                    style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', fontSize: actuatedNormalize(16), fontWeight: '500' }}
                  >
                    Bitgesell
                  </Text>
                  <RadioButton
                    color={COLORS.ACCENT}
                    selected={selectedId === '1'}
                    onPress={() => {
                      setSelectedId('1')
                      setSelectedNetworkName(Networks.Bitgesell)
                    }}

                    id='1' />
                </View>
                <View style={styles.networkItemContainer}>
                  <Image
                    style={{ width: actuatedNormalize(46), height: actuatedNormalizeVertical(63) }}
                    source={supportedNetworks.Ethereum.icon} />
                  <Text
                    style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', fontSize: actuatedNormalize(16), fontWeight: '500' }}
                  >Ethereum
                  </Text>
                  <RadioButton
                    color={COLORS.ACCENT}
                    selected={selectedId === '2'}
                    onPress={() => {
                      setSelectedId('2')
                      setSelectedNetworkName(Networks.Ethereum)
                    }}

                    id='2' />

                </View>
                <View style={styles.networkItemContainer}>
                  <Image
                    style={styles.selectNetworkIcons}
                    source={supportedNetworks.BNBSmartChain.icon} />
                  <Text
                    style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', fontSize: actuatedNormalize(16), fontWeight: '500' }}
                  >
                    BNB Smart Chain
                  </Text>
                  <RadioButton
                    color={COLORS.ACCENT}
                    selected={selectedId === '3'}
                    onPress={() => {
                      setSelectedId('3')
                      setSelectedNetworkName(Networks.BNBSmartChain)
                    }}

                    id='3' />
                </View>
              </View>
            </View>
            <View style={{ marginTop: actuatedNormalizeVertical(32), justifyContent: 'center', alignItems: 'center' }}>
              <Pressable
                style={{
                  borderRadius: actuatedNormalize(11),
                  width: actuatedNormalize(240),
                  height: actuatedNormalize(50),
                  marginBottom: actuatedNormalizeVertical(30),
                  backgroundColor: COLORS.ACCENT,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={() => {
                  handleNetworkSwitch()
                  setIsModalVisible(false)
                }}
              >
                <Text
                  style={{
                    fontSize: actuatedNormalize(16),
                    color: COLORS.WHITE,
                    fontWeight: '600',
                    fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : ''
                  }}
                >
                  Select
                </Text>
              </Pressable>
              <Pressable
                style={{
                  borderRadius: actuatedNormalize(11),
                  width: actuatedNormalize(240),
                  height: actuatedNormalize(50),
                  marginBottom: actuatedNormalizeVertical(18),
                  backgroundColor: COLORS.BLACK_ACCENT,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={() => {
                  setIsModalVisible(false)
                }}
              >
                <Text
                  style={{
                    fontSize: actuatedNormalize(16),
                    color: COLORS.WHITE,
                    fontWeight: '600',
                    fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : ''
                  }}
                >
                  Back
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* End Modal */}

        {/* BottomSheet */}
        <BottomSheetModalProvider>
          <BottomSheetModal
            style={{
              flex: 1,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.8,
              shadowRadius: 8,
              elevation: 4,
              borderTopLeftRadius: 10,
              borderRadius: actuatedNormalize(48),
              borderTopRightRadius: 10,
              overflow: 'hidden',
            }}
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            enableDynamicSizing={true}

          >
            <View style={{ flex: 1 }}>
              <BottomSheetView style={styles.contentContainer}>

                <View>
                  <Text style={[styles.bottomSheetHeading, { fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }]}>
                    Switch Accounts
                  </Text>
                </View>
                <View style={{ height: '50%', width: '100%' }}>
                  {loadingAccounts ? (<View>
                    <Text>Loading...</Text>
                  </View>) : (
                    <BottomSheetScrollView
                      automaticallyAdjustContentInsets={true}
                      scrollEnabled={true}
                    >{accounts?.map(renderItem)}</BottomSheetScrollView>
                  )}
                </View>
                <View style={{ width: '100%', marginTop: actuatedNormalize(12) }}>
                  <Pressable
                    onPress={() => {
                      bottomSheetModalRef.current?.dismiss()
                    }}
                    style={[styles.bottomSheetBtn, { backgroundColor: COLORS.BLACK_ACCENT }]}
                  >
                    <Text
                      style={[styles.bottomSheetBtnText, { color: COLORS.WHITE }]}
                    >
                      Back
                    </Text>
                  </Pressable>
                </View>
              </BottomSheetView>
            </View>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View >
    </ScrollView >
  )
}

export default Wallet

const styles = StyleSheet.create({
  contentContainer: {
    minHeight: actuatedNormalizeVertical(500),
    // borderRadius: actuatedNormalize(48),
    alignItems: 'center',
    width: '100%',
    padding: actuatedNormalize(20),
    paddingBottom: actuatedNormalize(20),
    backgroundColor: COLORS.WHITE,

  },
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetcontentContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  bottomSheetHeading: {
    fontSize: actuatedNormalize(18),
  },
  bottomSheetBtn: {
    height: actuatedNormalizeVertical(60),
    width: '100%',
    // borderColor: COLORS.ACCENT,
    borderWidth: .8,
    borderRadius: actuatedNormalize(13),
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomSheetBtnText: {
    color: COLORS.ACCENT,
    fontSize: actuatedNormalize(16)
  },
  // container: {
  //   flex: 1,
  //   padding: 24,
  //   backgroundColor: 'grey',
  // },
  walletContentContainer: {
    padding: actuatedNormalize(20),
    width: '100%',
    flex: 1,
  },
  walletContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: 20,

  },
  switchNetworkContainer: {
    width: '100%',
    marginTop: actuatedNormalizeVertical(34)
  },
  networkPicker: {
    borderRadius: actuatedNormalize(50),
    paddingLeft: actuatedNormalize(24),
    paddingRight: actuatedNormalize(24),
    width: '100%',
    backgroundColor: 'rgba(255, 186, 10, 0.11)',
    height: actuatedNormalizeVertical(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 186, 10, 0.11)',
  },
  networkIcon: {
    height: actuatedNormalizeVertical(20),
    width: actuatedNormalize(20)
  },
  networkPickerModal: {
    backgroundColor: COLORS.WHITE,
    borderRadius: actuatedNormalize(30),
    padding: actuatedNormalize(35),
    paddingBottom: actuatedNormalizeVertical(55),
    minHeight: actuatedNormalizeVertical(400),
    width: actuatedNormalize(335)
  },
  selectNetworkIcons: {
    height: actuatedNormalizeVertical(45),
    width: actuatedNormalize(45)
  },
  networkItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: actuatedNormalizeVertical(25)
  },
  accountContainer: {
    width: '100%',
    height: actuatedNormalizeVertical(167),
    borderWidth: 1,
    borderRadius: actuatedNormalize(13),
    borderColor: COLORS.ACCENT,
    marginTop: actuatedNormalize(40)
  },
  assetContainer: {
    marginTop: actuatedNormalizeVertical(21)
  }
})