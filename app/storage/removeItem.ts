import AsyncStorage from "@react-native-async-storage/async-storage"

interface IPrams {
  key: string
  id?: string
}

export const removeItem = async ({
  key,
  id
}: IPrams) => {
  try {
    await AsyncStorage.removeItem(
      key
    )
  } catch (error) {

    // @ts-ignore
    throw new Error(error?.message);
  }
}