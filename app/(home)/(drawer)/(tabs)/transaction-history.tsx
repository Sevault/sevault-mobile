import { COLORS } from '@/app/COLORS'
import { API } from '@/app/network/rpc'
import { Tx, TxOjbect } from '@/app/types'
import {
  BGLAccount,
  getCurrentAccount,
  Networks
} from '@/app/utils'
import { actuatedNormalize, actuatedNormalizeVertical } from '@/components/Dimension'
import displayToast from '@/components/Toast'
import { loadAccountTxHisory } from '@/features/wallet/walletSlice'
import {
  Poppins_400Regular,
  Poppins_500Medium, useFonts
} from '@expo-google-fonts/poppins'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useDispatch } from 'react-redux'

export const ICONS = {
  BGL: require('@/assets/bgl.png'),
  ETH: require('@/assets/ethereum.png'),
  BNB: require('@/assets/bnb-chain.png'),
  USDT: require('@/assets/usdt.png')
}

interface TxItem {
  tx_id: string
  timestamp: number
  amount: number
  confirmations: number
  block_height: number
  rbf: boolean
  coinbase: boolean
  fee: number
}

interface TxHistoryItemProps {
  id: number
  tx_id: string
  timestamp: number
  amount: number
  confirmations: number
  block_height: number
  rbf: boolean
  coinbase: boolean
  fee: number
  network: Networks
  to: string | null
  from: string | null
  selectedAddress: string
  asset: 'BGL' | 'ETH' | 'BNB' | 'USDT'
  onClick?: (item: TxItem) => void
}

export const truncateHash = (hash: string) => {
  const start = hash.slice(0, 8)
  const end = hash.slice(-5)
  return `${start}...${end}`
}

const TxHistoryItem = ({
  tx_id,
  timestamp,
  amount,
  confirmations,
  coinbase,
  fee,
  network,
  to,
  from,
  selectedAddress,
  block_height,
  asset,
  onClick,
}: TxHistoryItemProps) => {

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular
  })

  return (
    <Pressable onPress={() => onClick()} style={styles.txHistoryItem}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>

        <View>
          <Image style={{ height: asset == 'ETH' ? actuatedNormalizeVertical(32) : actuatedNormalize(35), width: asset == 'ETH' ? actuatedNormalize(23) : actuatedNormalize(35) }} source={ICONS[asset]} />
        </View>
        <View>
          {asset === 'BGL' ? (
            <Text style={{ fontWeight: '600' }}>{amount < 0 ? 'Sent' : 'Received'}</Text>

          ) : (<Text>

            <Text style={{ fontWeight: '600' }}>Confirmed</Text>

          </Text>)}
          {tx_id ? (<Text style={{ color: '#888888' }}>{truncateHash(tx_id)}</Text>) : <Text>Pending</Text>}
        </View>
        <Text style={{ color: amount < 0 ? COLORS.BLACK_ACCENT : COLORS.ACCENT, fontWeight: '500' }}>{Number(amount).toFixed(2)}{asset}</Text>
      </View>
    </Pressable>
  )
}

interface INoTxHistoryProps {
  onPress: () => void
}

const NoTxHistoy = ({
  onPress
}: INoTxHistoryProps) => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium
  })

  const [clicked, setClicked] = React.useState<boolean>(false)

  return (
    <View style={{ alignItems: 'center' }}>

      <View style={{ flexDirection: 'row', height: 50, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          style={{
            height: 30,
            width: 30,
          }}
          source={require('@/assets/info-dark.png')} />
        <Text style={{
          color: COLORS.BLACK,
          paddingLeft: 5,
          paddingRight: 20,
          fontSize: 12,
          fontFamily: fontsLoaded ? 'Poppins_500Medium' : ''
        }}>
          No transactions yet! New Transactions should appear here.
        </Text>
      </View>

      <Pressable
        onPress={() => {
          onPress()
          setClicked(true)
        }}
        onPressOut={() => {
          setTimeout(() => {
            setClicked(false)
          }, 5000)
        }}
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.ACCENT,
          width: actuatedNormalize(130),
          height: actuatedNormalizeVertical(40),
          borderRadius: actuatedNormalize(5)
        }}
      >
        <Text
          style={{

            color: COLORS.WHITE,
            paddingLeft: 5,
            paddingRight: 20,
            fontSize: 12,
            fontFamily: fontsLoaded ? 'Poppins_500Medium' : ''
          }}
        >
          {clicked ? 'Refreshing...' : 'Refresh'}
        </Text>
      </Pressable>
    </View>

  )
}

export default function TransactioHistory() {

  const {
    asset,
    address,
    privateKey,
    balance,
    network
  } = useLocalSearchParams()

  const selectedAsset = asset ? asset : 'BGL'

  let selectedNetwork = network ? network : Networks.Bitgesell

  const navigation = useNavigation()

  const [isLoading, setisLoading] = useState(true)
  const [currentAccount, setCurrentAccount] = useState({})
  // @ts-ignore
  const [txHistory, settxHistory] = useState<Array<Tx>>([])
  const dispatch = useDispatch()
  const [refreshState, setRefresh] = useState(true)
  // works only for Bitgesell
  async function fetchAccountHistory() {
    settxHistory([])
    // use url params to dynamicall load the address and privateKey based
    const wallet = await getCurrentAccount() as BGLAccount
    let accountAddress = ''
    const { address: defaultAddress } = wallet
    if (!address) {
      // @ts-ignore
      accountAddress = defaultAddress
    } else {
      accountAddress = address
    }

    let selectedNetwork = ''
    if (!network) {
      // @ts-ignore
      selectedNetwork = Networks.Bitgesell
    } else {
      selectedNetwork = network
    }

    setRefresh(true)

    try {
      const api = new API()
      if (asset === 'USDT') {
        // @ts-ignore
        const transactions = await api.getUSDTTxHistory(accountAddress, selectedNetwork) as Array<Tx>
        settxHistory(transactions)
        // dispatch(loadAccountTxHisory({ transactions }))
        setisLoading(false)
        setRefresh(false)

      }

      const transactions = await api.getTransactionHistory(accountAddress, selectedNetwork) as Array<Tx>

      settxHistory(transactions)
      setisLoading(false)
      setRefresh(false)
    } catch (error) {
      settxHistory([])
      displayToast({ message: `${error}`, type: 'info' })
      setisLoading(false)
      setRefresh(false)
    }
  }

  useEffect(() => {
    fetchAccountHistory()
  }, [network, address, navigation, asset]);

  // format date, time
  // follow design
  // scroll view
  return (
    <View style={styles.transactionListViewContainer}>
      {/* Conditionally render if no txes after refresh returns an empty arrary/ if error render refresh button */}
      {txHistory && txHistory.length > 0 ? (
        <FlatList
          onRefresh={() => fetchAccountHistory()}
          refreshing={refreshState}
          renderItem={({ item }) => (
            <TxHistoryItem
              onClick={() => {
                router.push({
                  params: {
                    tx_id: item.tx_id,
                    network: network,
                    asset: selectedAsset,
                    timestamp: item.timestamp,
                    confirmations: item.confirmations,
                    amount: (Number(item.amount).toFixed(2)),
                    fee: item.fee,
                    to: item.to,
                    from: item.from,
                    block_height: item.block_height,
                    coinbase: item.coinbase
                  },
                  pathname: 'transaction-summary'
                })
              }}
              selectedAddress={address}
              network={selectedNetwork}
              asset={selectedAsset}
              timestamp={item.timestamp}
              tx_id={item.tx_id}
              amount={item.amount}
              id={item.id}
              confirmations={item.confirmations}
              block_height={item.block_height}
              rbf={item.rbf}
              coinbase={item.coinbase}
              fee={item.fee} />)}

          keyExtractor={(item: Tx) => item?.id}
          data={txHistory}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <NoTxHistoy onPress={fetchAccountHistory} />
        </View>
      )}
    </View>
  )


}

const styles = StyleSheet.create({
  transactionListViewContainer: {
    flex: 1,
    backgroundColor: `#FAFAFA`,
    padding: actuatedNormalize(20)
  },
  txHistoryItem: {
    width: '100%',
    paddingTop: actuatedNormalizeVertical(30),
    height: actuatedNormalizeVertical(50),
    marginBottom: actuatedNormalizeVertical(40)
  }
})