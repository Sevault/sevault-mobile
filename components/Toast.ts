import React from 'react'
import { Platform, Text, ToastAndroid, View } from 'react-native'
import Toast from 'react-native-toast-message'

interface IToastProps {
  message: string
  type: 'success' | 'error' | 'info'
}

const displayToast = ({
  message,
  type
}: IToastProps) => {
  Platform.OS === 'android' ? ToastAndroid.show(message, ToastAndroid.SHORT) : Toast.show({ text1: message, type })
}

export default displayToast