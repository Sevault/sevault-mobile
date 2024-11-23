import { COLORS } from "@/app/COLORS"
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from "@react-navigation/drawer"
import { usePathname, useRouter } from "expo-router"
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'

import * as Clipboard from 'expo-clipboard'

import {
  Poppins_200ExtraLight,
  Poppins_500Medium,
  useFonts
} from "@expo-google-fonts/poppins"
import { Feather } from "@expo/vector-icons"
import {
  useEffect,
  useState
} from "react"

import { INetwork } from "@/app/(home)/wallet"
import { SET_DEFAULT_NETWORK } from "@/app/storage/keys"
import {
  IAccounts,
  IWallet,
  getAccounts,
  getItem,
  supportedNetworks
} from "@/app/utils"
import SettingsSN from '@/components/SettingsSN'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { actuatedNormalize, actuatedNormalizeVertical } from "./Dimension"
import HomeIcon from "./HomeIconSN"
import LogoutSN from "./LogoutSN"
import WalletLogoSN from "./WalletLogoSN"
import displayToast from "./Toast"

const CustomDrawerContent = (props: any) => {
  const router = useRouter()
  const { top, bottom } = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_200ExtraLight
  })

  const pathname = usePathname()

  const [currentAccount, setCurrentAccount] = useState<IWallet>()
  const [network, setNetwork] = useState<INetwork>()

  const [loading, setloading] = useState(true)

  const [currentAddress, setcurrentAddress] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const [account, setAccount] = useState<IWallet>()

  useEffect(() => {
    const loadNetworkState = async () => {

      const defaultNetwork = await getItem(SET_DEFAULT_NETWORK)
      const network = supportedNetworks[defaultNetwork.network] as INetwork
      const id = await getItem('network_id')

      const accounts = await getAccounts(defaultNetwork.network) as IAccounts
      return { accounts: accounts.accounts, network: network }
    }

    loadNetworkState().then((result) => {
      setAccount(result.accounts[0])
      setcurrentAddress(result.accounts[0].address)
      setNetwork(result.network)

      setloading(false)

    }).catch(err => { return })
  }, [])

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(currentAddress!!)
  }

  return (
    // safe are all over for padding and consistency across all devices as required in the docs. Applies to pages
    <View style={{ flex: 1, paddingTop: actuatedNormalizeVertical(50) }}>
      <View style={styles.customDrawerHeader}>
        {
          loading ? (<Text>Loading...</Text>) : (<>
            <View style={{ alignItems: 'center' }}>
              <Text style={[styles.customDrawerHeading, { fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }]}>
                {network?.name} Account {account?.index}
              </Text>
            </View>
            <View>
              <Text
                onPress={() => {
                  copyToClipboard()
                  setCopied(true)
                  displayToast({ message: 'Copied to clipboard!', type: 'info' })
                }}
                onPressOut={() => {
                  setTimeout(() => {
                    setCopied(false)
                  }, 5 * 1000)
                }}
                style={[{ fontSize: 14, fontFamily: fontsLoaded ? 'Poppins_200ExtraLight' : '' }]}>
                {account?.address}
              </Text>
              <Feather
                name={copied ? "check-square" : "copy"}
                onPressOut={() => {
                  setTimeout(() => {
                    setCopied(false)
                  }, 5 * 1000)
                }}
                size={22}

                onPress={() => {
                  copyToClipboard()
                  displayToast({ message: 'Copied address to clipboard!', type: 'info' })
                  setCopied(true)
                }} />
            </View>
          </>)
        }
      </View>

      <DrawerContentScrollView>

        <DrawerItem
          onPress={() => {
            router.push('(drawer)/(tabs)/wallet')
          }}
          label={'Wallet'}
          labelStyle={[{
            marginLeft: -20,
            fontSize: 14,
            fontFamily: fontsLoaded ? 'Poppins_500Medium' : '',

          }]}

          icon={({ size, color }) => (
            <IconContainer>
              <WalletLogoSN />
            </IconContainer>
          )}
          style={{ backgroundColor: '#F5F5F5' }}
        />
        <DrawerItemList {...props} />

        <DrawerItem
          onPress={() => {
            router.push('(drawer)/(tabs)/settings')
          }}
          label={'Settings'}
          labelStyle={[{
            marginLeft: -20,
            fontSize: 14,
            fontFamily: fontsLoaded ? 'Poppins_500Medium' : ''

          }]}
          // inactiveTintColor={COLORS.BLACK_ACCENT}
          // activeTintColor={COLORS.BLACK}
          // inactiveBackgroundColor={COLORS.WHITEOO1}
          // activeBackgroundColor="rgba(204, 204, 204, 0.5)"
          icon={({ size, color }) => (
            <IconContainer>
              <SettingsSN />
            </IconContainer>
          )}
          style={{ backgroundColor: '#F5F5F5' }}

        />
      </DrawerContentScrollView>

      <View style={[styles.customDrawerFooter, { marginBottom: actuatedNormalizeVertical(20) + bottom }]}>
        <View style={{ width: '100%', paddingEnd: actuatedNormalize(20), paddingStart: actuatedNormalize(20), paddingTop: actuatedNormalize(20) }}>
          <Pressable
            onPress={() => { router.replace('/open-wallet/') }}
            style={{
              backgroundColor: COLORS.ACCENT,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              width: '100%',
              borderRadius: actuatedNormalize(13),
              height: actuatedNormalizeVertical(60)
            }}>
            <LogoutSN />
            <Text
              style={[styles.footerButtonText, { fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }]}>Log Out</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default CustomDrawerContent

function IconContainer({ children }: any) {
  return (
    <View style={{ backgroundColor: COLORS.WHITE, height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginStart: actuatedNormalize(15) }}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  customDrawerHeader: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 17
  },
  customDrawerHeading: {
    fontSize: 15,
    color: COLORS.BLACK,
    fontWeight: '600'
  },
  customDrawerFooter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    paddingStart: 10
  }
})