import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable
} from 'react-native'
import React from 'react'
import { formatDollar } from '@/app/utils'
import { COLORS } from '@/app/COLORS'

const successImg = require('@/assets/transaction_success.png')
const failImg = require('@/assets/transaction_fail')

interface TransactionFeedbackProps {
  txSubmitStatus: 'Fail' | 'Success'
  txHash: string,
  amountBGL: number,
  amountUSD: number
}

const TransactionFeedback = ({
  txSubmitStatus,
  txHash,
  amountBGL,
  amountUSD
}: TransactionFeedbackProps) => {

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeading}>
        <Image source={txSubmitStatus == 'Success' ? successImg : failImg} />
      </View>
      <View style={styles.modalBody}>
        <Text style={styles.modalTitle}>
          Transaction {txSubmitStatus}!
        </Text>
        <Text style={styles.modalLabelText}>amount</Text>
        <Text style={styles.modalSubtitle}>{formatDollar.format(amountUSD)}</Text>
        <Text style={styles.modalLabelText}>{amountBGL} BGL</Text>
      </View>
      <View style={styles.modalFooter}>
        <Pressable
          onPress={() => {
            // back to send
          }}
          style={styles.modalFooterButton}
        >
          <Text style={styles.modalButtonLabel}>Back</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            // route to master detail
            // transaction-history:{txHash}
          }}
          style={styles.modalFooterButton}>
          <Text style={styles.modalButtonLabel}>View Summary</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default TransactionFeedback

const styles = StyleSheet.create({
  modalContainer: {
    height: 469
  },
  modalHeading: {
    alignContent: 'center'
  },
  modalBody: {
    alignContent: 'center'
  },
  modalFooter: {
    alignContent: 'center'
  },
  modalTitle: {
    color: COLORS.BLACK,
    fontSize: 24,
    fontWeight: '600'
    // @todo: fontFamily: poppins 600(semibold)
  },
  modalSubtitle: {
    fontWeight: '500',
    color: COLORS.BLACK_ACCENT
  },
  modalLabelText: {
    fontSize: 13,
    color: COLORS.WHITE003
    // @todo: fontFamily: poppins regular 600(semibold)
  },
  modalFooterButton: {
    backgroundColor: COLORS.BLACK_ACCENT,
    justifyContent: 'center',
    alignContent: 'center'
  },
  modalButtonLabel: {
    color: COLORS.WHITE,
    fontWeight: '600',
    fontSize: 16
    // @todo: fontFamily: poppins regular 600(semibold)
  }
})