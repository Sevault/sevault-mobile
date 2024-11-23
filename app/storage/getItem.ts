import AsyncStorage from '@react-native-async-storage/async-storage'

interface IGetItemConfig {
  key: string
}

export const getItem = async (key: string) => {
  try {
    const item = await AsyncStorage.getItem(key)
    if (item) return JSON.parse(item)
    else return item
  } catch (error) {
    // @ts-ignore
    throw new Error(error?.message)
  }
}