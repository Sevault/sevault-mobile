import { COLORS } from '@/app/COLORS'
import {
  actuatedNormalize,
  actuatedNormalizeVertical
} from '@/components/Dimension'
import DrawerBackIcon from '@/components/DrawerBackIcon'
import {
  Poppins_500Medium,
  Poppins_600SemiBold, useFonts
} from '@expo-google-fonts/poppins'
import { Feather } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import {
  router,
  useLocalSearchParams,
  useNavigation
} from 'expo-router'
import React, { useRef, useState } from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'

// Requires the debug build:
// import Share from 'react-native-share'

interface IShareableAddressCardProps {
  tokenUri: string
  address: string
  network: string
  asset: string

}

const ShareableAddressCard = ({
  tokenUri,
  address,
  network,
  asset
}: IShareableAddressCardProps) => {
  return (
    <View style={styles.addressCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', height: actuatedNormalize(174), width: actuatedNormalize(174) }}>
        <QRCode
          value={address as string}
          logo={{ uri: tokenUri }}
          logoSize={30}
        />
      </View>

      <View style={{ marginTop: actuatedNormalizeVertical(20) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Text style={{ color: '#888888' }}>Network</Text>
          <Text style={{ fontWeight: '700' }}>{network}</Text>
        </View>
      </View>

      <View style={{ marginTop: actuatedNormalizeVertical(20) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Text style={{ color: '#888888' }}>Wallet Address</Text>
          <Text style={{ fontWeight: '700' }}>{address}</Text>
        </View>
      </View>

      <View style={{ paddingTop: actuatedNormalizeVertical(30), paddingBottom: actuatedNormalizeVertical(30) }}>
        <Text style={{ color: '#888888', }}>
          Only send {asset} ({network}) to address.
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Image
          style={{ height: actuatedNormalizeVertical(134), width: actuatedNormalize(48) }}
          source={require('@/assets/sevault-sm.png')}
        />
      </View>
    </View>
  )
}

const ReceiveBGL = () => {

  const {
    network,
    asset,
    privateKey,
    address,
    balance
  } = useLocalSearchParams()

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold
  })

  const navigation = useNavigation();

  const captureRefAddress = useRef()

  React.useEffect(() => {
    navigation.setOptions({
      title: `Receive ${asset}`,
      headerTitleAlign: 'center',
      backBehavior: 'history',
      // goBack hack: goBack doesn't work: so we push previous route+initial params
      headerLeft: () => (
        <View style={{ marginLeft: actuatedNormalize(19) }}>
          <DrawerBackIcon onpress={() => router.push({
            pathname: 'asset-info',
            params: {
              network,
              asset,
              privateKey,
              address,
              balance
            }
          })} />
        </View>)
    });

  })

  const TokenLogosBase64 = {
    BGL: 'data:image/png;base64,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',
    BNB: 'data:image/png;base64,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',
    WBGL: 'data:image/png;base64,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',
    ETH: 'data:image/png;base64,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',
    USDT: 'data:image/png;base64,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'
  }

  const [copied, setCopied] = useState<boolean>(false)
  const [sharing, setSharing] = useState<boolean>(false)

  const [copiedText, setCopiedText] = useState<string>('')


  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(address as string);
  }

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };


  return (
    <ScrollView style={styles.receiveContainer}>
      <View ref={captureRefAddress} style={{ borderRadius: actuatedNormalize(20) }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: actuatedNormalize(50) }}>
          <QRCode
            value={address as string}
            logo={{ uri: TokenLogosBase64[asset] }}
            logoSize={30}
          />
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: actuatedNormalize(35), borderRadius: actuatedNormalize(15) }}>
          <View style={{ backgroundColor: '#F5F5F5', borderRadius: actuatedNormalize(15), minHeight: actuatedNormalizeVertical(96), minWidth: actuatedNormalize(235), padding: actuatedNormalize(18), justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: actuatedNormalize(15), color: '#AAAAAA', margin: actuatedNormalize(6) }}>
              {asset} ({network}) Address
            </Text>
            <View>
              <Text style={{ fontSize: actuatedNormalize(16), paddingLeft: actuatedNormalize(16), paddingRight: actuatedNormalize(16), fontWeight: '600' }}>
                {address}
              </Text>
              <Pressable style={{ margin: actuatedNormalize(16) }}
                onPress={() => {
                  copyToClipboard()
                  setCopied(true)
                }}>
                {!sharing ? (<Feather name={copied ? "check-square" : "copy"} size={24} color="black" />) : null
                }
              </Pressable>
            </View>
          </View>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: actuatedNormalizeVertical(29) }}>
          <Text style={{ color: COLORS.BLACK, fontSize: actuatedNormalize(16) }}>
            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.BLACK_ACCENT }}> Send only ({network}) {asset}</Text> to this address.
            Sending any other Assets may lead to their permanent <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.BLACK_ACCENT }}>irretrievable loss.</Text>
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: actuatedNormalize(30) }}>


      </View>
    </ScrollView >
  )
}

export default ReceiveBGL

const styles = StyleSheet.create({
  receiveContainer: {
    flex: 1,
    width: '100%',
    padding: actuatedNormalize(20),
    backgroundColor: COLORS.WHITE
  },
  addressCard: {
    height: actuatedNormalizeVertical(400),
    width: actuatedNormalize(300),
    borderRadius: actuatedNormalize(20),
    padding: actuatedNormalize(39)
  }
})