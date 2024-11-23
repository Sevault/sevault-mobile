import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput
} from 'react-native'

import React from 'react'
import { actuatedNormalize, actuatedNormalizeVertical } from '@/components/Dimension'
import { ScrollView } from 'react-native-gesture-handler'
import { COLORS } from '@/app/COLORS'
import { SelectList } from 'react-native-dropdown-select-list'
import { copyToClipboard, getAccounts, IAccounts, Networks } from '@/app/utils'
import * as ScreenCapture from 'expo-screen-capture'
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  useFonts
} from '@expo-google-fonts/poppins'
import Modal from 'react-native-modal'
import FontAwesome from '@expo/vector-icons/build/FontAwesome'
import { router, useNavigation } from 'expo-router'
import DrawerBackIcon from '@/components/DrawerBackIcon'

interface IKeyValue {
  key: string
  value: string
}

interface IPrivKeyAddressPair {
  privateKey: string
  address: string
}

const viewPrivateKeyStatus = {

  Confirm: {
    title: 'Done',
    message: 'Are you sure you want to view private key?',
    icon: require('@/assets/tx-success.png')
  }

}

type ViewPrivateKeyState = 'Confirm' | 'Viewed'

const ViewSeed = () => {
  ScreenCapture.usePreventScreenCapture()
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_400Regular
  })
  const navigation = useNavigation()

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: `Back Up Wallet`,
      headerTitleAlign: 'center',
      backBehavior: 'history',
      // goBack hack: goBack doesn't work: so we push previous route+initial params
      headerLeft: () => (
        <View style={{ marginLeft: actuatedNormalize(19) }}>
          <DrawerBackIcon onpress={() => router.push('/settings')} />
        </View>)
    });
  }, [navigation])

  const [selectedNetwork, setSelected] = React.useState<Networks>(null)
  const [addresses, setAddresses] = React.useState<Array<IKeyValue>>([])
  const [viewStatus, setViewStatus] = React.useState<ViewPrivateKeyState>('Confirm')
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)
  const [privateKeys, setPrivateKeys] = React.useState<Array<IPrivKeyAddressPair>>([])
  const [selecedAddress, setselecedAddress] = React.useState<string>(null)
  const [secure, setSecurePassword] = React.useState<boolean>(true)
  const [isSeedphraseFocused, setIsSeedphraseFocused] = React.useState<boolean>(false)
  const [copied, setIsCopied] = React.useState(false)

  const [details, setDetails] = React.useState({
    network: '',
    privateKey: ''
  })

  const networks = [
    { key: '1', value: Networks.Bitgesell },
    { key: '2', value: Networks.Ethereum },
    { key: '3', value: Networks.BNBSmartChain },
  ]


  const handleNetworkSelect = async () => {

    setAddresses((addresses) => {
      if (addresses.length > 0) return []
      return [...addresses]
    })

    const accounts = await getAccounts(selectedNetwork) as IAccounts
    const addresses = accounts.accounts.map(account => {
      return {
        key: account.index,
        value: account.address
      }
    })

    const privateKeys = accounts.accounts.map(account => {
      return {
        privateKey: account.privateKey,
        address: account.address,
      }
    })

    const menmonic = accounts.mnemonic

    // @ts-ignore
    setAddresses(addresses)
    setPrivateKeys(privateKeys)
  }

  const handleNetworkViewPrivateKey = () => {

    const privateKey = privateKeys.filter(pair => pair.address == selecedAddress)
    setDetails({
      network: selectedNetwork,
      privateKey: privateKey.at(0)?.privateKey as string
    })

  }

  const handleCopyToClipboard = () => {
    copyToClipboard(details.privateKey).then(() => setIsCopied(true))
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ minHeight: actuatedNormalizeVertical(350) }}>
        <Text style={{ fontSize: actuatedNormalize(18), fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>View Seed/Private Key</Text>
        <View style={{ width: '100%', marginTop: actuatedNormalize(10), }}>
          <Text style={{ fontFamily: fontsLoaded ? 'Poppins_400Regular' : '' }}>Select Network:</Text>

          <SelectList
            onSelect={async () => {
              // populate the accounts state
              await handleNetworkSelect()
            }}
            search={false}
            setSelected={(val) => setSelected(val)}
            data={networks}
            save="value"
          />
        </View>
        <View style={{ width: '100%', marginTop: actuatedNormalizeVertical(35) }}>
          {addresses.length > 0 ? (
            <>
              <Text style={{ fontFamily: fontsLoaded ? 'Poppins_400Regular' : '' }}>Select Account:</Text>

              <SelectList
                dropdownShown={addresses.length === 0}
                search={false}
                onSelect={async () => {
                  handleNetworkViewPrivateKey()
                }}
                setSelected={(val) => setselecedAddress(val)}
                data={addresses}
                save="value"
              />

            </>
          ) : null}
        </View>
        <View style={{ width: '100%', marginTop: actuatedNormalizeVertical(25) }}>
          <Pressable
            onPress={() => {
              setIsModalVisible(true)
            }}
            disabled={!selectedNetwork && !selecedAddress}
            style={{ backgroundColor: COLORS.BLACK_ACCENT, height: actuatedNormalize(42), marginTop: actuatedNormalizeVertical(10), alignItems: 'center', justifyContent: 'center', borderRadius: 11, opacity: !selectedNetwork && !selecedAddress ? 0.6 : 1 }}>
            <Text style={[styles.buttonText, { fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }]}>
              View Wallet Private Key
            </Text>
          </Pressable>

        </View>
      </View>

      {/* Modal: Change Password */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalViewRoot}>
          <View style={styles.modalView}>
            <View style={styles.animatedImageContainer}>
              <Image
                source={viewPrivateKeyStatus[viewStatus].icon}
                style={{ height: actuatedNormalizeVertical(80), width: actuatedNormalizeVertical(80) }}
              />
            </View>
            <View style={styles.messageContainer}>
              <Text style={[styles.messageTitle, { fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }]}>
                {viewPrivateKeyStatus[viewStatus].title}
              </Text>
              <Text style={{ marginBottom: actuatedNormalize(10) }}>Private key for <Text style={{ fontWeight: '600' }}>{selecedAddress}</Text> on <Text style={{ fontWeight: '600' }}>{selectedNetwork}</Text> Network.</Text>
              {viewStatus === 'Confirm' ? (
                <View style={{ width: '100%', }}>
                  <View style={{ flexDirection: 'row' }}>

                    <TextInput
                      multiline={true}
                      numberOfLines={5}
                      autoCorrect={true}
                      textContentType='none'
                      value={details.privateKey}
                      style={[styles.passwordInput, { borderColor: isSeedphraseFocused ? COLORS.ACCENT : COLORS.WHITE004 }]}
                      onFocus={() => setIsSeedphraseFocused(true)}
                      editable={false}
                      onBlur={() => {
                        setIsSeedphraseFocused(false)
                      }}

                    />
                    <FontAwesome
                      name={copied ? "check" : "copy"}
                      size={24}
                      onPress={() => { handleCopyToClipboard() }}
                      onPressOut={() => {
                        setTimeout(() => {
                          setIsCopied(false)
                        }, 2000)

                      }}
                      color={COLORS.BLACK_ACCENT}
                      style={{ marginLeft: actuatedNormalize(-32), marginTop: (12), }}
                    />
                  </View>
                  <Text style={{ color: COLORS.DANGER, paddingTop: actuatedNormalizeVertical(5) }}>Never share your private keys as this will lead to irretrievable loss of assets from your wallet.</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.actionButtonContainer}>
              <Pressable
                style={styles.actionButtton}
                onPress={() => {
                  setIsModalVisible((status) => !status)
                }}
              >
                <Text style={{ color: COLORS.WHITE, fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>Back</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default ViewSeed

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: actuatedNormalize(20)
  },
  buttonText: {
    color: COLORS.WHITE,
    fontWeight: '600',
    fontSize: actuatedNormalize(16)

  },
  privatKeyField: {
    width: '100%',
    height: actuatedNormalizeVertical(120),
    borderStyle: 'solid',
    borderWidth: 1,
    paddingLeft: actuatedNormalize(15),
    paddingRight: actuatedNormalize(15),
    borderRadius: actuatedNormalize(4),

  },

  modalViewRoot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: actuatedNormalize(30),
    padding: actuatedNormalize(45),
    width: actuatedNormalize(335),
    // height: actuatedNormalizeVertical(461),
    backgroundColor: COLORS.WHITE
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  animatedImageContainer: {
    alignItems: 'center'
  },
  messageContainer: {
    alignItems: 'center'
  },
  actionButtonContainer: {
    paddingTop: actuatedNormalizeVertical(20),
    alignItems: 'center'
  },
  messageTitle: {
    color: COLORS.BLACK,
    paddingBottom: actuatedNormalizeVertical(4),
    paddingLeft: actuatedNormalize(14),
    paddingRight: actuatedNormalize(14),
    fontSize: actuatedNormalize(18)
  },
  messageText: {
    fontSize: actuatedNormalize(16),
    paddingBottom: actuatedNormalizeVertical(26)
  },
  actionButtton: {
    width: actuatedNormalize(240),
    height: actuatedNormalizeVertical(50),
    borderRadius: actuatedNormalize(11),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK_ACCENT
  },
  passwordInput: {
    width: '100%',
    height: actuatedNormalizeVertical(120),
    borderStyle: 'solid',
    borderWidth: 1,
    paddingLeft: actuatedNormalize(15),
    paddingRight: actuatedNormalize(15),
    borderRadius: actuatedNormalize(4),

  },

})