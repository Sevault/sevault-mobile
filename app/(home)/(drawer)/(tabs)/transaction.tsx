import { COLORS } from '@/app/COLORS'
import { formatTimeStampToDateString } from '@/app/utils'
import {
  Link,
  useLocalSearchParams,
} from 'expo-router'
import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'

interface TransactionProps { }

const Transaction = () => {

  const {
    tx_id,
    timestamp,
    confirmations,
    amount,
    fee,
    block_height,
    coinbase
  } = useLocalSearchParams();

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

      <View style={styles.transactionItemView}>
        <Text style={styles.transactionItemText}>
          Amount
        </Text>
        <Text style={{ color: COLORS.ACCENT }}>
          {amount}BGL
        </Text>
      </View>

      <View style={styles.transactionItemView}>
        <Text style={styles.transactionItemText}>Confirmed</Text>

        {confirmations ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <Image
              style={{ height: 12, width: 12 }}
              source={require('@/assets/confirmed.png')}
            />
            <Text style={{ color: '#07A00D' }}>confirmed</Text>
          </View>

        ) : (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center' }}>
            <Image
              style={{ height: 12, width: 12 }}
              source={require('@/assets/pending.png')}
            />
            <Text style={{ color: COLORS.WHITE003 }}>pending</Text>
          </View>
        )}
      </View>
      <View style={styles.transactionItemView}>
        <Text style={styles.transactionItemText}>
          Fee
        </Text>
        <Text>
          {fee}BGL
        </Text>
      </View>
      <View style={styles.transactionItemView}>
        <Text style={styles.transactionItemText}>
          Confirmations
        </Text>
        <Text>
          {confirmations}
        </Text>
      </View>

      <View style={styles.transactionItemView}>
        <Text style={styles.transactionItemText}>
          Block#
        </Text>
        <Text>
          {block_height}
        </Text>
      </View>

      <View style={styles.transactionItemView}>
        <Text style={styles.transactionItemText}>
          Coinbase
        </Text>
        <Text>
          {coinbase}
        </Text>
      </View>
      <Text style={{ marginBottom: 15 }}>{formatTimeStampToDateString(timestamp)}</Text>
      <Link
        style={{ color: COLORS.ACCENT }}
        href={`https://bgl.bitaps.com/${tx_id}`}
      >View Transaction in Block Explorer</Link>

      <Link
        href={{
          pathname: '/transaction'
        }}
        style={{
          color: COLORS.ACCENT,
          paddingTop: 25,
          fontSize: 16,
          // fontFamily: fontsLoaded ? 'Poppins_400Regular' : ''
        }}>
        Back
      </Link>
    </View>
  )
}

export default Transaction

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