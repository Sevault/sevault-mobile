import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import {
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import BouncyCheckbox from "react-native-bouncy-checkbox";

import { useFonts } from '@expo-google-fonts/poppins/useFonts';
import { Feather } from '@expo/vector-icons';
import { COLORS } from 'app/COLORS';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';

import CustomBGLlogo from '@/components/CustomBGLlogo';
import InfoWarn from '@/components/InforWarn';
import displayToast from '@/components/Toast';
import { createWallet, setWalletBackup } from '@/features/wallet/walletSlice';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { API } from '../network/rpc';
import {
  APP_INSTALL_STATE,
  BGLAccount,
  IWallet,
  Networks,
  saveAccounts,
  saveAppInstallState,
  savePassword,
  saveWallet,
  setCurrentAccountInStorage
} from '../utils';
import {
  actuatedNormalize,
  actuatedNormalizeVertical
} from '@/components/Dimension';
import { saveItem } from '../storage/saveItem';
import { SET_DEFAULT_NETWORK } from '../storage/keys';

const CreateNewWallet = () => {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setPasswordConfirm] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [secure, setSecurePassword] = useState<boolean>(true)
  const [secureConfirmPassword, setSecureConfirmPassword] = useState<boolean>(true)

  const [isConfirmFocused, setIsConfirmFocused] = useState<boolean>(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false)
  const [checkValidityFlag, setCheckPasswordMatchValidityFlag] = useState<boolean>(false)
  const [hasAcceptPasswordConditions, setAcceptPasswordConditions] = useState<boolean>(false)

  // 1. dispatch(action(payload))
  const dispatch = useDispatch()

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_700Bold
  })

  const handleSubmit = async () => {

    setIsSubmitting(submitting => !submitting)
    const api = new API()

    try {
      const [bitgesellAccounts, ethereumAccounts, bnbWallets] = await Promise.all([api.createBitgesellAccounts(), api.createEthereumWallet(), api.createBNBSmartChainWallet()])


      // @ts-ignore
      if (!bitgesellAccounts) {
        displayToast({ message: 'Unknow Error occured. Please try again', type: 'error' })
        setIsSubmitting(submitting => !submitting)
      }

      // @ts-ignore
      if (bitgesellAccounts && ethereumAccounts && bnbWallets) {
        displayToast({ message: 'Wallet created!', type: 'info' })
        await saveWallet(JSON.stringify(bitgesellAccounts))

        const walletBackup = {
          bnb: {
            address: bnbWallets.accounts[0].address,
            privateKey: bnbWallets.accounts[0].privateKey
          },
          bgl: {
            seedphrase: bitgesellAccounts.mnemonic,
            address: bitgesellAccounts.accounts[0].address,
            privateKey: bitgesellAccounts.accounts[0].address
          },
          eth: {
            address: ethereumAccounts.accounts[0].address,
            privateKey: ethereumAccounts.accounts[0].address
          }
        }
        dispatch(setWalletBackup(walletBackup))
        const accountIndex0 = bitgesellAccounts.accounts[0]
        const mnemonic = bitgesellAccounts.mnemonic
        const account: IWallet = {
          mnemonic,
          ...accountIndex0,
          active: true,
          imported: true,
        }

        await saveAppInstallState(APP_INSTALL_STATE.onboarding)
        await saveWallet(JSON.stringify(account))

        await setCurrentAccountInStorage(account)
        await savePassword(password)

        await saveAccounts(Networks.Bitgesell, bitgesellAccounts)
        await saveItem({ data: JSON.stringify({ network: Networks.Bitgesell }), key: SET_DEFAULT_NETWORK })

        await saveAccounts(Networks.Ethereum, ethereumAccounts)
        await saveAccounts(Networks.BNBSmartChain, bnbWallets)

        dispatch(createWallet(account))
        await saveAppInstallState(APP_INSTALL_STATE.installed)

        router.replace('/save-wallet-phrase')
      }
    } catch (error) {
      // @ts-ignore
      displayToast({ message: `Failed to create wallet ${error.message}`, type: 'error' })
      setIsSubmitting(submitting => !submitting)
    }

  }

  const renderInforWarn = (
    isPasswordSame: boolean,
    checkValidityFlag: boolean
  ) => {

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'baseline', alignItems: 'center' }}>
        {!isPasswordSame && checkValidityFlag ? (<>
          <InfoWarn />
          <Text style={{ color: 'rgba(255, 0, 0, 0.6)', marginLeft: 4 }}>
            Passwords do not match. Please check.
          </Text>
        </>
        ) : null
        }
      </View>
    )
  }

  return (
    <View style={styles.createWalletContainer}>
      <StatusBar backgroundColor={COLORS.ACCENT} style='light' />
      <View style={{ paddingBottom: 27, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <CustomBGLlogo />
      </View>
      <View style={styles.walletTextContainer}>
        <Text
          style={[styles.walletContainerHeading, { fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }]}>
          Create New Wallet
        </Text>
        <Text style={styles.walletText}>
          Create a new  Bitgesell Wallet to  manage all your
          BGL and other assets.
        </Text>
      </View>
      <View style={styles.createWalletForm}>
        <View>
          <Text style={[styles.inputLabel, { fontFamily: fontsLoaded ? 'Poppins_700Bold' : '' }]}>
            Password
          </Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={[styles.passwordInput, { borderColor: isPasswordFocused ? COLORS.ACCENT : COLORS.WHITE004 }]}
              placeholder='Password'
              textContentType='password'
              onChangeText={(text) => {
                setPassword(text)
              }}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => {
                setIsPasswordFocused(false)
                // setCheckPasswordMatchValidityFlag(true)
              }
              }
              secureTextEntry={secure}
              value={password}
              autoCorrect={false}
              autoComplete='off'
            />
            <Feather
              name={secure ? "eye" : "eye-off"}
              size={24}
              onPress={() => {
                setSecurePassword((secure) => !secure)
              }}
              color={COLORS.BLACK_ACCENT}
              style={{ marginLeft: actuatedNormalize(-32), marginBottom: actuatedNormalizeVertical(40), }}
            />
          </View>
          <Text style={[styles.inputLabel, { fontFamily: fontsLoaded ? 'Poppins_700Bold' : '' }]}>
            Confirm Password
          </Text>

          <View style={styles.passwordInputContainer}>
            <TextInput
              style={[styles.confirmPasswordInput, { borderColor: isConfirmFocused ? COLORS.ACCENT : COLORS.WHITE004 }]}
              textContentType='password'
              onFocus={() => setIsConfirmFocused(true)}
              onBlur={() => {
                setIsConfirmFocused(false)
                setCheckPasswordMatchValidityFlag(true)
              }}
              secureTextEntry={secureConfirmPassword}
              placeholder='Confirm password'
              autoCorrect={false}
              onChangeText={(text) => {
                setPasswordConfirm(text)
              }}
            />
            <Feather
              name={secureConfirmPassword ? "eye" : "eye-off"}
              size={24}
              onPress={() => {
                setSecureConfirmPassword((secureConfirm) => !secureConfirm)
              }}
              color={COLORS.BLACK_ACCENT}
              style={{ marginLeft: actuatedNormalize(-32), marginBottom: actuatedNormalizeVertical(15), }}
            />
          </View>
          {renderInforWarn(password === confirmPassword, checkValidityFlag)}
        </View>
        <Text style={styles.walletText}>
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
              href='/(app)/import-existing-wallet'
            >
              Or Import wallet from existing PrivateKey or SeedPhrase
            </Link>
          </Text>
        </View>
        <View style={{ paddingBottom: 25, paddingEnd: 20, maxWidth: '90%' }}>
          <BouncyCheckbox
            style={{ paddingTop: actuatedNormalizeVertical(15) }}
            size={25}
            fillColor={COLORS.ACCENT}
            text="I understand Sevault Wallet can not recover this password for me."
            iconStyle={{
              borderColor: "red",
              borderRadius: 0
            }}
            innerIconStyle={{
              borderRadius: 0
            }}
            textStyle={{
              fontSize: actuatedNormalize(14),
              textDecorationLine: 'none',
              color: COLORS.BLACK
            }}
            onPress={(isChecked: boolean) => {
              setAcceptPasswordConditions((isChecked) => !isChecked)
            }}
          />
        </View>
        <View style={styles.submitButtonContainer}>
          <Pressable style={[styles.submitButton, { opacity: !hasAcceptPasswordConditions || (!password || !confirmPassword || password !== confirmPassword) ? 0.6 : 1 }]}
            disabled={!hasAcceptPasswordConditions || (!password || !confirmPassword || password !== confirmPassword)}
            onPress={async () => {
              await handleSubmit()
            }}>
            {/*TODO: use preloader three dot animation*/}
            {isSubmitting ? <Text style={[styles.submitButtonText, { fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }]}>Please Wait</Text> : (<Text style={[styles.submitButtonText, { fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }]}>Create A New Wallet</Text>)}
          </Pressable>
        </View>
      </View>
      <Toast />
    </View>
  )
}

export default CreateNewWallet

const styles = StyleSheet.create({
  createWalletContainer: {
    paddingTop: actuatedNormalizeVertical(50),
    flex: 1,
    backgroundColor: COLORS.WHITE,
    maxWidth: '100%',
    paddingLeft: actuatedNormalize(20),
    paddingRight: actuatedNormalize(20),
    paddingBottom: actuatedNormalizeVertical(90),
  },
  walletTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  walletContainerHeading: {
    color: COLORS.BLACK_ACCENT,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
    paddingBottom: actuatedNormalizeVertical(10)
  },
  walletText: {
    color: COLORS.BLACK,
    fontSize: actuatedNormalize(16),
    paddingTop: actuatedNormalizeVertical(10),
    paddingBottom: actuatedNormalizeVertical(15)
  },

  createWalletForm: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'

  },
  passwordInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  inputLabel: {
    color: COLORS.BLACK,
    fontSize: actuatedNormalize(16),
    fontWeight: '700',
  },
  passwordInput: {
    marginTop: actuatedNormalizeVertical(8),
    borderRadius: actuatedNormalize(4),
    width: '100%',
    fontSize: actuatedNormalize(16),
    height: actuatedNormalizeVertical(50),
    // marginRight: 28,
    borderStyle: 'solid',
    paddingLeft: actuatedNormalize(15),
    borderWidth: 1,
    borderTopColor: COLORS.WHITE,
    borderEndColor: COLORS.WHITE,
    borderLeftColor: COLORS.WHITE,
    borderRightColor: COLORS.WHITE,
    marginBottom: actuatedNormalizeVertical(40)
  },
  confirmPasswordInput: {
    paddingLeft: actuatedNormalize(15),
    marginTop: actuatedNormalizeVertical(8),
    borderRadius: actuatedNormalize(4),
    width: '100%',
    fontSize: actuatedNormalize(16),
    height: actuatedNormalizeVertical(50),
    // marginRight: 28,
    borderStyle: 'solid',
    borderWidth: 1,
    borderTopColor: COLORS.WHITE,
    borderEndColor: COLORS.WHITE,
    borderLeftColor: COLORS.WHITE,
    borderRightColor: COLORS.WHITE,
    marginBottom: actuatedNormalizeVertical(15)
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '100%',
    height: actuatedNormalizeVertical(50),
    borderRadius: actuatedNormalize(11),
    backgroundColor: COLORS.ACCENT,
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: actuatedNormalize(16),
    fontWeight: '500'
  },
  submitButtonContainer: {
    // marginTop: 158
  }
})