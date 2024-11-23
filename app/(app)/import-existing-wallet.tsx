import { FontAwesome } from '@expo/vector-icons'
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'

import {
  Poppins_600SemiBold
} from '@expo-google-fonts/poppins'
import Modal from 'react-native-modal'

import { useFonts } from '@expo-google-fonts/poppins/useFonts'

import { COLORS } from '@/app/COLORS'
import {
  Image,
  ScrollView
} from 'react-native'

import {
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'
import React, { useState } from 'react'
import Toast from 'react-native-toast-message'

import { API } from '@/app/network/rpc'
import {
  APP_INSTALL_STATE,
  IWallet,
  Networks,
  saveAccounts,
  saveAppInstallState,
  savePassword,
  saveWallet,
  setCurrentAccountInStorage
} from '@/app/utils'
import CustomBGLlogo from '@/components/CustomBGLlogo'
import {
  actuatedNormalize,
  actuatedNormalizeVertical
} from '@/components/Dimension'
import displayToast from '@/components/Toast'
import { createWallet, setWalletBackup } from '@/features/wallet/walletSlice'
import { Feather } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { useDispatch } from 'react-redux'
import { SET_DEFAULT_NETWORK } from '../storage/keys'
import { saveItem } from '../storage/saveItem'

const ImportExistingWallet = () => {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium
  })

  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false)
  const [secure, setSecurePassword] = useState<boolean>(true)
  const [isSeedphraseFocused, setIsSeedphraseFocused] = useState<boolean>(false)
  const [hasAcceptPasswordConditions, setAcceptPasswordConditions] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [seedOrPkey, setSeedPkey] = useState<string>('')
  const [isSubmitting, setIsubmitting] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)


  const dispatch = useDispatch()

  const handleImportWallet = async () => {
    setIsubmitting(true)
    try {
      const api = new API()
      const [wallet, ethereumAccounts, bnbWallets] = await Promise.all([api.importWallet(seedOrPkey), api.createEthereumWallet(), api.createBNBSmartChainWallet()])

      if (wallet) {
        if (wallet && ethereumAccounts && bnbWallets) {
          await saveWallet(JSON.stringify(wallet))
          console.log('wallet:', wallet)
          const accountIndex0 = wallet.accounts[0]
          const mnemonic = wallet.accounts[0].mnemonic
          const account: IWallet = {
            mnemonic,
            ...accountIndex0,
            active: true,
            imported: true,
          }
          const walletBackup = {
            bnb: {
              address: bnbWallets.accounts[0].address,
              privateKey: bnbWallets.accounts[0].privateKey
            },
            bgl: {
              seedphrase: wallet.accounts[0].mnemonic,
              address: wallet.accounts[0].address,
              privateKey: wallet.accounts[0].address
            },
            eth: {
              address: ethereumAccounts.accounts[0].address,
              privateKey: ethereumAccounts.accounts[0].address
            }
          }

          dispatch(setWalletBackup(walletBackup))

          await saveAppInstallState(APP_INSTALL_STATE.installed)
          await saveWallet(JSON.stringify(account))

          await setCurrentAccountInStorage(account)
          await savePassword(password)

          await saveAccounts(Networks.Bitgesell, wallet)
          await saveItem({ data: JSON.stringify({ network: Networks.Bitgesell }), key: SET_DEFAULT_NETWORK })
          setIsModalVisible(true)
          await saveAccounts(Networks.Ethereum, ethereumAccounts)
          await saveAccounts(Networks.BNBSmartChain, bnbWallets)

          dispatch(createWallet(account))
          displayToast({ message: 'Wallet created!', type: 'info' })

          router.push('/save-wallet-phrase')
        }

      }
    } catch (error) {
      setIsubmitting(false)
      displayToast({ message: `Failed, Try again: ${error}`, type: 'error' })
    }
  }
  const fetchClipboardContent = async () => {
    const text = await Clipboard.getStringAsync();
    setSeedPkey(text);
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }} style={{ flex: 1 }}>
      <View style={[styles.createWalletContainer, {}]}>
        <StatusBar backgroundColor={COLORS.ACCENT} style='light' />
        <View style={styles.customLogoContainer}>
          <CustomBGLlogo />
        </View>
        <View style={styles.walletTextContainer}>
          <Text style={[styles.walletContainerHeading, { fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }]}>
            Import
            Existing Wallet
          </Text>
          <Text style={styles.walletText}>
            Effortlessly switch to Bitgesell Wallet by pasting your Bitgesell mnemonic phrase or privateKey.
            Adhoc Ethereum & BNB wallets will be added automatically. Private Keys can be retrieved from app settings.
          </Text>
        </View>
        <View style={styles.createWalletForm}>

          <Text style={[styles.inputLabel, { paddingBottom: 5 }]}>
            Seedphrase/Privatekey
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              multiline={true}
              numberOfLines={5}
              autoCorrect={true}
              textContentType='none'
              value={seedOrPkey}
              style={[styles.passwordInput, { borderColor: isSeedphraseFocused ? COLORS.ACCENT : COLORS.WHITE004, fontWeight: 'bold' }]}
              placeholder='Seedphrase/Privatekey'
              onFocus={() => setIsSeedphraseFocused(true)}
              onChangeText={(text) => {
                setSeedPkey(text)
              }}
              onBlur={() => {
                setIsSeedphraseFocused(false)
              }}

              placeholderTextColor={COLORS.WHITE003}
            />
            <Text
              onPress={() => fetchClipboardContent()}
              style={{ marginLeft: actuatedNormalize(-45), marginTop: (10), color: COLORS.ACCENT, fontWeight: 'bold' }}
            >
              Paste
            </Text>

          </View>
          <View style={{ paddingTop: actuatedNormalizeVertical(15), paddingBottom: actuatedNormalizeVertical(15), width: '100%' }}>
            <Text style={[styles.inputLabel, { paddingBottom: 5 }]}>
              Password
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                secureTextEntry={secure}
                textContentType='password'
                autoCorrect={false}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => {
                  setIsPasswordFocused(false)
                }}
                onChangeText={(text) => {
                  setPassword(text)
                }}
                style={[styles.passwordInput, { height: 50, borderColor: isPasswordFocused ? COLORS.ACCENT : COLORS.WHITE004 }]}
                placeholder='Password'
                placeholderTextColor={COLORS.WHITE003}
              />
              <Feather
                name={secure ? "eye" : "eye-off"}
                size={24}
                onPress={() => {
                  setSecurePassword((secure) => !secure)
                }}
                color={COLORS.BLACK_ACCENT}
                style={{ marginLeft: -32, marginTop: 12, }}
              />
            </View>
          </View>

          <Text style={[styles.walletText, { paddingTop: 10 }]}>
            🔒 Keep this password safe as it will be used to keep your wallet safe on this device.
          </Text>
          <View>
            <Text>
              <Link
                style={{
                  textDecorationColor: COLORS.ACCENT,
                  textDecorationStyle: 'dotted',
                  borderBottomColor: COLORS.ACCENT,
                  borderBottomWidth: actuatedNormalize(1),
                  borderStyle: 'dotted',
                  color: COLORS.ACCENT,
                  fontSize: actuatedNormalize(16)
                }}
                href='/(app)/create-new-wallet'
              >
                Or Create a New Wallet for a fresh start.
              </Link>
            </Text>
          </View>

          <View style={{ paddingBottom: actuatedNormalizeVertical(25), paddingEnd: actuatedNormalize(20), maxWidth: '90%' }}>

            <BouncyCheckbox
              style={{ paddingTop: actuatedNormalizeVertical(15) }}
              size={25}
              fillColor={COLORS.ACCENT}
              text="I understand Bitgesell Wallet can not recover this password for me."
              iconStyle={{
                borderColor: "red",
                borderRadius: 0
              }}
              innerIconStyle={{
                borderRadius: 0
              }}
              textStyle={{
                fontSize: 14,
                textDecorationLine: 'none',
                color: COLORS.BLACK
              }}
              onPress={(isChecked: boolean) => {
                setAcceptPasswordConditions((isChecked) => !isChecked)
              }}
            />
          </View>
          <View style={{ width: '100%' }}>
            <Pressable
              disabled={!hasAcceptPasswordConditions || password === '' || seedOrPkey === ''}
              style={[styles.submitButton, { opacity: !hasAcceptPasswordConditions || password === '' || seedOrPkey === '' ? 0.6 : 1 }]}

              onPress={async () => {
                await handleImportWallet()
              }}>
              {isSubmitting ? <Text style={[styles.submitButtonText, { fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }]}>Please Wait</Text> : (<Text style={[styles.submitButtonText, { fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }]}>Import Existing Wallet</Text>)}
            </Pressable>
          </View>
        </View>
        <Toast />
      </View>
      {/* Modal */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalViewRoot}>
          <View style={styles.modalView}>
            <View style={styles.animatedImageContainer}>
              <Image
                source={require('@/assets/success_confetti.png')}
                style={{ height: 151.22, width: 129.32 }}
              />
            </View>
            <View style={styles.messageContainer}>
              <Text style={[styles.messageTitle, { fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }]}>
                Congratulations!
              </Text>
              <Text style={[styles.messageText]}>
                Your account is ready to use. You will be redirected to the home page in a few seconds.
              </Text>
            </View>
            <View style={styles.actionButtonContainer}>
              <Pressable
                style={styles.actionButtton}
                onPress={() => {
                  setIsModalVisible(false)
                  router.replace('/(tabs)/home)/')
                }}
              >
                <Text style={{ color: COLORS.WHITE, fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>Back to Home</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default ImportExistingWallet

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  createWalletContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingTop: actuatedNormalizeVertical(20),
    paddingLeft: actuatedNormalize(20),
    paddingRight: actuatedNormalize(20),
  },
  customLogoContainer: {
    paddingBottom: actuatedNormalizeVertical(20),
    paddingTop: actuatedNormalizeVertical(27),
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  walletTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  walletContainerHeading: {
    color: COLORS.BLACK_ACCENT,
    fontSize: actuatedNormalize(18),
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
    paddingBottom: actuatedNormalizeVertical(15)
  },
  walletText: {
    color: COLORS.BLACK,
    fontSize: actuatedNormalize(16),
    paddingBottom: actuatedNormalizeVertical(15)
  },
  passwordInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  createWalletForm: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  inputLabel: {
    color: COLORS.BLACK,
    fontSize: actuatedNormalize(16),
    paddingBottom: actuatedNormalizeVertical(3),
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold'

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

  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: actuatedNormalizeVertical(50),
    borderRadius: actuatedNormalize(11),
    backgroundColor: COLORS.ACCENT,
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: actuatedNormalize(16),
    fontWeight: '500'
  },
  // submitButtonContainer: {
  //     marginTop: 158
  // }
  modalViewRoot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: actuatedNormalize(30),
    padding: actuatedNormalize(45),
    width: actuatedNormalize(335),
    height: actuatedNormalizeVertical(461),
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
    alignItems: 'center'
  },
  messageTitle: {
    color: COLORS.BLACK,
    paddingBottom: actuatedNormalizeVertical(24),
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
  }
})