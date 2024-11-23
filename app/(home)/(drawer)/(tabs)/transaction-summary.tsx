import { COLORS } from '@/app/COLORS'
import { Networks } from '@/app/utils'
import { actuatedNormalize, actuatedNormalizeVertical } from '@/components/Dimension'
import DrawerBackIcon from '@/components/DrawerBackIcon'
import {
  Link,
  router,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'

interface TransactionProps { }

export const EXPLORERS = {
  ETH: 'https://etherscan.io/tx/',
  BNB: 'https://bscscan.com/tx/',
  BEP20USDT: 'https://bscscan.com/tx/',
  ERC20USDT: 'https://etherscan.io/tx/',
  BGL: 'https://bgl.bitaps.com/'
}

export const formatBlockExplorerLink = (network: Networks) => {
  if (network === Networks.Ethereum) {
    return EXPLORERS.ETH
  }
  if (network === Networks.BNBSmartChain) {
    return EXPLORERS.BNB
  }
  if (network === Networks.Bitgesell) {
    return EXPLORERS.BGL
  }
}

const TransactionSummary = () => {

  const {
    tx_id,
    timestamp,
    network,
    confirmations,
    amount,
    fee,
    block_height,
    coinbase,
    unconfirmed, // unconfirmed
    txHash,
    from,
    to,
    asset
  } = useLocalSearchParams();

  const navigation = useNavigation()

  const formatFeeLabel = (asset: string, network: Networks) => {
    if (asset == 'ETH') {
      return asset
    }
    if (asset === 'BGL') {
      return asset
    }
    if (asset === 'USDT' && network === Networks.Ethereum) {
      return 'ETH'
    }
    if (asset === 'USDT' && network === Networks.BNBSmartChain) {
      return 'BNB'
    }
  }

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: `Transaction summary`,
      headerTitleAlign: 'center',
      backBehavior: 'history',
      // goBack hack: goBack doesn't work: so we push previous route+initial params
      headerLeft: () => (
        <View style={{ marginLeft: actuatedNormalize(19) }}>
          <DrawerBackIcon onpress={() => router.push({
            pathname: 'transaction-history',
            params: {
              tx_id,
              timestamp,
              network,
              confirmations,
              amount,
              fee,
              block_height,
              coinbase,
              unconfirmed, // unconfirmed
              txHash,
              from,
              to,
              asset
            }
          })} />
        </View>)
    });
    // left side menu, share(display bottom share sheet with link to the transaction explorer)
  }, [navigation])

  if (unconfirmed) {
    return (<View style={styles.transaction}>

      <View style={{ marginBottom: 50 }}>
        <Text style={styles.transactionItemText}>
          TxId:
        </Text>
        <Text style={styles.transactionItemValue}>
          {tx_id}
        </Text>
      </View>
      <View style={[styles.transactionItemView, { flexWrap: 'wrap' }]}>
        <Text style={styles.transactionItemText}>
          Recepient
        </Text>
        <Text style={{ color: COLORS.ACCENT }}>
          {to}
        </Text>
      </View>

      <View style={styles.transactionItemView}>
        <Text style={styles.transactionItemText}>
          Amount
        </Text>
        <Text style={{ color: COLORS.ACCENT }}>
          {amount}{asset}
        </Text>
      </View>

      <View style={styles.transactionItemView}>
        <Text style={styles.transactionItemText}>Status</Text>


        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center' }}>
          <Image
            style={{ height: 12, width: 12 }}
            source={require('@/assets/pending.png')}
          />
          <Text style={{ color: COLORS.WHITE003 }}>pending</Text>
        </View>

      </View>
      <View style={styles.transactionItemView}>
        <Text style={styles.transactionItemText}>
          Fee
        </Text>
        <Text>
          {fee}{formatFeeLabel(asset as string, network)}
        </Text>
      </View>
      <View style={styles.transactionItemView}>
        <Text style={styles.transactionItemText}>
          Confirmations
        </Text>
        <Text style={{ color: COLORS.WHITE003 }}>
          Pending
        </Text>
      </View>

      <View style={styles.transactionItemView}>
        <Text style={styles.transactionItemText}>
          Block#
        </Text>
        <Text style={{ color: COLORS.WHITE003 }}>
          pending
        </Text>
      </View>

      <View style={styles.transactionItemView}>
        <Text style={styles.transactionItemText}>
          Coinbase
        </Text>
        <Text style={{ color: COLORS.WHITE003 }}>
          {coinbase}
        </Text>
      </View>
      {/* <Text style={{ marginBottom: actuatedNormalizeVertical(15) }}>{formatTimeStampToDateString(timestamp)}</Text> */}
      <Link
        style={{ color: COLORS.ACCENT }}
        href={`${formatBlockExplorerLink(network as Networks)}${txHash}`}
      >
        View Transaction in Block Explorer
      </Link>


    </View>)
  } else {
    return (
      <View style={styles.transaction}>

        <View style={{ marginBottom: 50 }}>
          <Text style={styles.transactionItemText}>
            TxId:
          </Text>
          <Text style={styles.transactionItemValue}>
            {tx_id}
          </Text>
        </View>

        {from ? (
          <View style={[styles.transactionItemView, { flexWrap: 'wrap' }]}>
            <Text style={styles.transactionItemText}>
              From
            </Text>
            <Text style={{ color: COLORS.ACCENT }}>
              {from}
            </Text>
          </View>
        ) : null}
        {to ? (
          <View style={[styles.transactionItemView, { flexWrap: 'wrap' }]}>
            <Text style={styles.transactionItemText}>
              To
            </Text>
            <Text style={{ color: COLORS.ACCENT }}>
              {to}
            </Text>
          </View>
        ) : null}
        <View style={styles.transactionItemView}>
          <Text style={styles.transactionItemText}>
            Amount
          </Text>
          <Text style={{ color: COLORS.ACCENT }}>
            {amount}{asset}
          </Text>
        </View>

        <View style={styles.transactionItemView}>
          <Text style={styles.transactionItemText}>Confirmed</Text>


          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center' }}>
            <Image
              style={{ height: actuatedNormalizeVertical(12), width: actuatedNormalize(12) }}
              source={require('@/assets/confirmed.png')}
            />
            <Text style={{ color: COLORS.WHITE003 }}>Confirmed</Text>
          </View>

        </View>
        <View style={styles.transactionItemView}>
          <Text style={styles.transactionItemText}>
            Fee
          </Text>
          <Text>
            {fee}{formatFeeLabel(asset as string, network as Networks)}
          </Text>
        </View>
        <View style={styles.transactionItemView}>
          <Text style={styles.transactionItemText}>
            Confirmations
          </Text>
          <Text style={{ color: COLORS.WHITE003 }}>
            {confirmations}
          </Text>
        </View>

        <View style={styles.transactionItemView}>
          <Text style={styles.transactionItemText}>
            Block#
          </Text>
          <Text style={{ color: COLORS.WHITE003 }}>
            {block_height}
          </Text>
        </View>

        <View style={styles.transactionItemView}>
          <Text style={styles.transactionItemText}>
            Coinbase
          </Text>
          <Text style={{ color: COLORS.WHITE003 }}>
            {coinbase}
          </Text>
        </View>
        {/* <Text style={{ marginBottom: actuatedNormalizeVertical(15) }}>{formatTimeStampToDateString(timestamp)}</Text> */}
        <Link
          style={{ color: COLORS.ACCENT }}
          href={`${formatBlockExplorerLink(network as Networks)}${txHash}`}
        >
          View Transaction in Block Explorer
        </Link>
      </View>
    )
  }
}


export default TransactionSummary

const styles = StyleSheet.create({
  transaction: {
    padding: 30,
    width: '100%',
    backgroundColor: COLORS.WHITE,
    flex: 1
  },
  transactionItem: {

  },
  transactionItemText: {
    fontWeight: '600'
  },
  transactionItemValue: {
    color: COLORS.WHITE003
  },
  transactionItemView: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})