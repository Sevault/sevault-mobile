import * as Notifications from 'expo-notifications';
import { Networks } from '../utils';


export async function requestPushNotificationPermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

type Asset = 'ETH' | 'BGL' | 'BNB' | 'USDT'

export async function triggerBalanceNotification(asset: Asset, newBalance: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${asset} Balance Update`,
      body: `Sevault ${asset} balance has been updated!. New balance is USD ${newBalance.toFixed(2)}!`,
      sound: true,
    },
    trigger: { seconds: 1 },
  });
}

export interface IReceipt {
  tx_id: string
  to: string
  amount: number
  asset: Asset
  network: Networks
  unconfirmed: boolean
  fee: number
  coinbase: boolean
}

export async function triggerSendSuccesfulNotification(asset: Asset, data: IReceipt) {
  await Notifications.scheduleNotificationAsync({
    content: {
      // @ts-ignore
      data: JSON.stringify(data),
      title: `${asset} completed successfully`,
      body: `Transfer of ${data.amount} to ${data.to} succesful. Tap to view summary.`
    },
    trigger: { seconds: 1 },
  })
}