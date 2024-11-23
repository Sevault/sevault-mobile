import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'
import { useFonts } from '@expo-google-fonts/poppins/useFonts'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS } from 'app/COLORS'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Modal as ReactModal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'

import CustomBGLlogo from '@/components/CustomBGLlogo'
import {
  actuatedNormalize,
  actuatedNormalizeVertical
} from '@/components/Dimension'
import InfoWarn from '@/components/InforWarn'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import Modal from 'react-native-modal'
import { CURRENT_ACCOUNT, INSTALL_STATE, PASSWORD } from '../storage/keys'
import { removeItem } from '../storage/removeItem'
import { Networks, verifyPassword } from '../utils'


import * as LocalAuthentication from 'expo-local-authentication'
import displayToast from '@/components/Toast'

interface IBiometricModal {
  visible: boolean,
  onClose: () => void
}

const biometric = {
  fail: 'Failed. Try again later.',
  pending: 'Touch the fingerprint sensor.',
  sucess: 'Authenicated!'
}

type BiometricStates = 'fail' | 'pending' | 'success'

const renderBiometricText = (state: BiometricStates) => {
  switch (state) {
    case 'pending':
      return (<Text>{biometric.pending}</Text>)
    case 'success':
      return (<Text>{biometric.sucess}</Text>)
    case 'fail':
      return (<Text style={{ color: COLORS.RED }}>{biometric.fail}</Text>)
  }
}

const BiometricModal = ({ visible, onClose }: IBiometricModal) => {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [biometricStatus, setBiometricStatus] = useState<BiometricStates>('pending')
  const handleAuthentication = async () => {
    try {
      setLoading(false)

      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      if (!hasHardware) {
        return
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        return
      }

      setLoading(false)

      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: true,
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        setStatus('success')
        setTimeout(() => {
          onClose()
          router.replace('/(tabs)/home/')
        }, 200)
      } else {
        setStatus('fail')
      }
    } catch (error) {
      setStatus('fail')
      displayToast({ message: 'An unexpected error occurred.', type: 'info' });
      onClose();
    }
  };

  React.useEffect(() => {
    if (visible) {
      setStatus('')
      handleAuthentication()
    }
  }, [visible]);

  return (
    <ReactModal visible={visible} transparent animationType="slide">
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <>
              <Text style={modalStyles.title}>
                {status === 'success' ? 'Done!' :
                  status === 'fail' ? 'Authentication Failed' :
                    'Please authenticate and access Sevault Wallet'}
              </Text>
              <Image
                source={require('@/assets/fingerprint.png')} // Replace with your fingerprint icon
                style={[
                  modalStyles.icon,
                  status === 'success' ? modalStyles.success :
                    status === 'fail' ? modalStyles.fail : null,
                ]}
              />
              <View style={{ marginTop: actuatedNormalize(18) }}>
                {renderBiometricText(biometricStatus)}
              </View>
              <View style={{ flexDirection: 'row', marginTop: actuatedNormalizeVertical(73) }}>
                <Pressable
                  style={modalStyles.button}
                  onPress={() => {
                    if (status) {
                      setStatus('')
                      onClose()
                    } else {
                      setStatus('')
                      handleAuthentication()
                    }
                  }}>
                  <Text style={modalStyles.buttonText}>
                    {status ? 'Close' : 'Retry'}
                  </Text>
                </Pressable>
                <Pressable
                  style={modalStyles.button}
                  onPress={() => {
                    setStatus('')
                  }}
                >
                  <Text style={modalStyles.buttonText}>
                    Exit
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </ReactModal>
  );
};


const OpenWallet = () => {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_400Regular
  })

  const [password, setPassword] = useState<string>('')
  const [secure, setSecure] = useState<boolean>(true)
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false)
  const [isBiometricPressed, setBiometricPress] = useState<boolean>(false)
  const [isPasswordWrong, setIsPasswordWrong] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [biometricModalVisible, setBiometricModalVisible] = useState(false);
  const [hasBiometric, setHasBiometric] = useState(false)

  useEffect(() => {
    (async () => {

      const [hasHardware, isEnrolled] = await Promise.all([LocalAuthentication.hasHardwareAsync(), LocalAuthentication.isEnrolledAsync()])
      if (hasHardware && isEnrolled) {
        setHasBiometric(true)
      } else {
        setHasBiometric(false)
      }
    })()
  }, [])

  const toggleWalletResetModal = () => {
    setModalVisible(!isModalVisible);
  }

  const handleOpenWallet = async (method: string) => {

    if (method === 'password') {
      const isValid = await verifyPassword(password)
      if (isValid) {
        router.replace('/(tabs)/home/')
      } else {
        setIsPasswordWrong(true)
      }
    }

  }


  const handleResetWallet = async () => {
    await removeItem({ key: INSTALL_STATE })
    await removeItem({
      key: PASSWORD
    })
    await removeItem({ key: CURRENT_ACCOUNT })
    await removeItem({ key: Networks.BNBSmartChain })
    await removeItem({ key: Networks.Ethereum })
    await removeItem({ key: Networks.Bitgesell })
    router.replace('/create-new-wallet')
  }

  const renderInforWarn = (
    isPasswordWrong: boolean
  ) => {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'baseline',
        alignItems: 'center'
      }}>
        {
          isPasswordWrong ? (<>
            <InfoWarn />
            <Text style={{ color: 'rgba(255, 0, 0, 0.6)', marginLeft: 4 }}>
              Wrong Password. Try Again.
            </Text>
          </>
          ) : null
        }
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: COLORS.WHITE }} style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.ACCENT} style='light' />
      <View style={styles.createWalletContainer}>
        <View style={styles.walletTextContainer}>
          <View style={{ marginBottom: actuatedNormalizeVertical(10) }}>
            <CustomBGLlogo />
          </View>
          <Text style={[styles.walletContainerHeading, { fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }]}>
            Welcome Back!
          </Text>
        </View>
        <View style={styles.openWalletForm}>
          <Text style={[styles.inputLabel, { fontFamily: fontsLoaded ? 'Poppins_700Bold' : '' }]}>
            Enter Password
          </Text>

          <View style={styles.passwordInputContainer}>
            <TextInput
              style={[styles.passwordInput, { borderColor: isPasswordFocused ? COLORS.ACCENT : COLORS.WHITE004 }]}
              textContentType='password'
              secureTextEntry={secure}
              autoCorrect={false}
              clearTextOnFocus={true}

              onFocus={() => {
                setIsPasswordFocused(true)
                setIsPasswordWrong(false)
              }}
              onBlur={() => setIsPasswordFocused(false)}
              onChangeText={(text) => {
                setPassword(text)
              }}
            />

            <MaterialCommunityIcons
              name={'eye'}
              size={30}
              color={isBiometricPressed ? COLORS.ACCENT : COLORS.BLACK_ACCENT}
              onPress={() => {
                setSecure((secure) => !secure)
              }}
              onPressIn={() => setBiometricPress(true)}
              onPressOut={() => setBiometricPress(false)}
              style={{ marginLeft: -50, }}
            />

          </View>
          <View style={{ paddingLeft: actuatedNormalize(12), marginBottom: actuatedNormalizeVertical(20), marginTop: actuatedNormalizeVertical(10), }}>
            {renderInforWarn(isPasswordWrong)}
          </View>
          <Text style={[styles.walletText, { fontFamily: fontsLoaded ? 'Poppins_400Regular' : '' }]}>
            🔒 Keep this password safe as it will be used to keep your wallet safe on this device.
          </Text>
          {hasBiometric ? (<View style={{ marginTop: actuatedNormalizeVertical(12.5), width: '100%' }}>
            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>

              <Pressable
                onPress={() => setBiometricModalVisible(true)}
              >
                <Text style={[styles.walletText, { fontFamily: fontsLoaded ? 'Poppins_400Regular' : '', color: COLORS.ACCENT }]}>Unlock with Biometric</Text>
              </Pressable>
            </View>
          </View>) : null}
          <View style={styles.submitButtonContainer}>
            <Pressable
              style={[styles.submitButton, { opacity: password !== '' ? 1 : 0.6 }]}
              disabled={password === ''}
              onPress={async () => {
                await handleOpenWallet('password') // default password
              }}>
              <Text style={[styles.submitButtonText, { fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }]}>Unlock</Text>
            </Pressable>
          </View>
          <View style={{ marginTop: actuatedNormalizeVertical(24), flexDirection: 'row', width: '100%' }}>
            <Image
              style={{ height: actuatedNormalizeVertical(27), width: actuatedNormalize(27), paddingRight: actuatedNormalize(4) }}
              source={require('@/assets/info-dark.png')}
            />
            <Text style={[styles.walletText, { fontFamily: fontsLoaded ? 'Poppins_400Regular' : '' }]}>
              Wallet won’t unlock? You can Erase your current wallet and setup a new one
            </Text>
          </View>
          <View style={{ marginTop: actuatedNormalizeVertical(25), width: '100%' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

              <Pressable
                onPress={toggleWalletResetModal}
              >
                <Text style={[styles.walletText, { fontFamily: fontsLoaded ? 'Poppins_400Regular' : '', color: COLORS.ACCENT }]}>Reset Wallet</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <View>
        <Modal isVisible={isModalVisible}>
          <View style={{
            height: 'auto',
            backgroundColor: COLORS.WHITE,
            borderRadius: actuatedNormalize(23),
            paddingStart: actuatedNormalize(20),
            paddingEnd: actuatedNormalize(20),
            paddingTop: actuatedNormalizeVertical(20),
            paddingBottom: actuatedNormalizeVertical(35)
          }}>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                paddingTop: actuatedNormalizeVertical(30),
                alignItems: 'center',
              }}
            >
              <Image
                style={{ height: actuatedNormalizeVertical(77), width: actuatedNormalize(77) }}
                source={require('@/assets/red-alert.png')} />
              <Text style={{
                fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '',
                color: COLORS.RED,
                fontSize: actuatedNormalize(18),
                fontWeight: '600'
              }}>Are you Sure you want to Erase Wallet?</Text>
            </View>
            <View style={{ paddingTop: actuatedNormalizeVertical(5) }}>
              <Text
                style={{
                  fontSize: actuatedNormalize(16),
                  fontFamily: fontsLoaded ? 'Poppins_400Regular' : ''
                }}
              >
                Your current wallet, accounts and assets <Text style={{ fontWeight: 'bold' }}>will be removed from this app permanently</Text>. This action can not be reversed.
              </Text>
            </View>
            <View style={{ paddingTop: actuatedNormalizeVertical(5) }}>
              <Text style={{
                fontSize: actuatedNormalize(16),
                fontFamily: fontsLoaded ? 'Poppins_400Regular' : '',
                paddingBottom: actuatedNormalizeVertical(10)
              }}>
                You can only recover this wallet with your <Text style={{ fontWeight: 'bold' }}> Secret Recovery Phrase</Text> SeVault does not have your Secret Recovery Phrase.
              </Text>
            </View>
            <View>
              <Pressable
                onPress={handleResetWallet}
                style={{
                  height: actuatedNormalizeVertical(50),
                  borderRadius: actuatedNormalize(11),
                  backgroundColor: COLORS.RED,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '',
                    color: COLORS.WHITE,
                    fontWeight: '600'
                  }}
                >I understand, continue</Text>
              </Pressable>

              <Pressable
                onPress={() => setModalVisible(false)}
                style={{
                  height: actuatedNormalizeVertical(50),
                  borderRadius: actuatedNormalize(11),
                  marginTop: actuatedNormalizeVertical(15),
                  backgroundColor: COLORS.BLACK_ACCENT,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    fontSize: actuatedNormalize(16),
                    color: COLORS.WHITE,
                    fontWeight: '600',
                    fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : ''
                  }}
                >Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <BiometricModal
          onClose={() => setBiometricModalVisible(false)}
          visible={biometricModalVisible} />
      </View>
    </ScrollView>
  )
}

export default OpenWallet

const styles = StyleSheet.create({
  createWalletContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.WHITE,
    padding: actuatedNormalize(20)
  },
  walletTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: actuatedNormalizeVertical(35),
    paddingBottom: actuatedNormalizeVertical(70)
  },
  walletContainerHeading: {
    color: COLORS.BLACK_ACCENT,
    fontSize: actuatedNormalize(18),
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: actuatedNormalizeVertical(5)
  },
  walletText: {
    color: COLORS.BLACK_ACCENT,
    fontSize: actuatedNormalize(16),
    fontWeight: 'normal',
    marginBottom: actuatedNormalizeVertical(25)
  },

  openWalletForm: {
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
    // marginLeft: 12,
    marginBottom: actuatedNormalizeVertical(8),
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold'

  },
  passwordInput: {
    width: '100%',
    fontSize: actuatedNormalize(16),
    height: actuatedNormalizeVertical(70),
    borderStyle: 'solid',
    borderWidth: 1,
    paddingStart: actuatedNormalize(20),
    borderRadius: actuatedNormalize(7),
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
    fontWeight: '600',
  },
  submitButtonContainer: {
    // marginTop: 158
    width: '100%'
  }
})


const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: actuatedNormalize(335),
    minHeight: actuatedNormalize(424),
    padding: actuatedNormalize(20),
    paddingTop: actuatedNormalizeVertical(40),
    backgroundColor: 'white',
    borderRadius: actuatedNormalize(30),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: actuatedNormalize(10),
  },
  title: {
    fontSize: actuatedNormalize(16),
    fontWeight: '500',
    marginBottom: actuatedNormalizeVertical(20),
    textAlign: 'center',
  },
  icon: {
    width: actuatedNormalize(100),
    height: actuatedNormalize(100),
    marginBottom: actuatedNormalizeVertical(20),
    // tintColor: 'gray',
  },
  success: {
    tintColor: 'green',
  },
  fail: {
    tintColor: 'red',
  },
  button: {
    marginTop: actuatedNormalizeVertical(20),
    height: actuatedNormalizeVertical(50),
    minWidth: actuatedNormalize(100),
    // backgroundColor: COLORS.ACCENT,
    padding: actuatedNormalize(10),
    borderRadius: actuatedNormalize(5),
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.ACCENT,
    fontWeight: '600',
    fontSize: actuatedNormalize(16),
  },
});
