import AsyncStorage from "@react-native-async-storage/async-storage"
import { IWallet } from "../utils"

export interface IItem {
  key: string
  data: string
}

export const saveItem = async ({
  data,
  key,
}: IItem
) => {
  try {
    await AsyncStorage.setItem(key, data)
  } catch (error) {
    // @ts-ignore
    throw new Error(error?.message)
  }
}