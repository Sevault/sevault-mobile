import React, { useState } from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'

import { COLORS } from '@/app/COLORS'

import {
  actuatedNormalize,
  actuatedNormalizeVertical
} from '@/components/Dimension'

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  useFonts
} from '@expo-google-fonts/poppins'

import {
  CURRENT_ACCOUNT,
  INSTALL_STATE,
  PASSWORD
} from '@/app/storage/keys'
import { changePassword } from '@/app/utils'
import Feather from '@expo/vector-icons/Feather'
import Modal from 'react-native-modal'

import { removeItem } from '@/app/storage/removeItem'
import DrawerBackIcon from '@/components/DrawerBackIcon'
import { router, useNavigation } from 'expo-router'

interface IPasswordChangeStatus {
  Success: {
    title: string,
    message: string
    icon: string
  },
  Failed: {
    title: string,
    message: string
    icon: string
  },
  Pending: {
    title: string,
    message: string
    icon: string
  }

}

const passwordChangeStates: IPasswordChangeStatus = {
  Success: {
    title: 'Sucess!',
    message: 'Password change sucessful! Changes will be applied on the next login.',
    icon: require('@/assets/tx-success.png')
  },
  Failed: {
    title: 'Failed',
    message: 'Password change failed!',
    icon: require('@/assets/tx-fail.png')
  },
  Pending: {
    title: 'Pending',
    message: 'Password change sucessful!',
    icon: require('@/assets/tx-wait.png')
  }
}

interface IWalletDeleteState {
  Deleting: {
    title: string
    message: string
    icon: string
  },
  Deleted: {
    title: string
    message: string
    icon: string
  },
  Pending: {
    title: string
    message: string
    icon: string
  }
}

const deleteWalletStatus: IWalletDeleteState = {
  Deleting: {
    title: 'Reseting!',
    message: 'Password change sucessful! Changes will be applied on the next login.',
    icon: require('@/assets/tx-success.png')
  },
  Deleted: {
    title: 'Done',
    message: 'Wallet reset successful!',
    icon: require('@/assets/tx-success.png')
  },
  Pending: {
    title: 'Delete wallet',
    message: 'Confirm Delete Wallet. Wallet can be restored form private keys/seed phrase for a given Network.',
    icon: require('@/assets/confirm.png')
  }

}
type DeleteWalletStates = 'Deleting' | 'Deleted' | 'Pending'

type PasswordChangeState = 'Pending' | 'Failed' | 'Success'

const Settings = () => {

  // @todo: hook up global state
  // add Ethereum wallet
  // add Binance wallet
  // refine aesthetics
  // loader
  // improve the aestethics
  // add biometric option - enable, set, save
  // disable -toggle off
  // @set font for consistency with design

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_400Regular
  })

  const navigation = useNavigation()

  const [oldPasswordFocus, setoldPasswordFocus] = useState(false)
  const [newPasswordFocus, setNewPasswordFocus] = useState(false)

  const [oldPassword, setoldPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')

  const [passwordChangeError, setpasswordChangeError] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [passwordChangeState, setPasswordChangeStatus] = useState<PasswordChangeState>('Pending')
  const [secureOldPassword, setsecureOldPassword] = useState(true)
  const [secureNewPassword, setsecureNewPassword] = useState(true)

  const [deleteWalletState, setdeleteWalletState] = useState<DeleteWalletStates>('Pending')
  const [isDeleteModalVisible, setIsDeleteWalletModalVisible] = useState(false)

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: `Security`,
      headerTitleAlign: 'center',
      backBehavior: 'history',
      // goBack hack: goBack doesn't work: so we push previous route+initial params
      headerLeft: () => (
        <View style={{ marginLeft: actuatedNormalize(19) }}>
          <DrawerBackIcon onpress={() => router.push('/(tabs)/settings')} />
        </View>)
    });
  })

  const handlePasswordChange = async () => {
    setPasswordChangeStatus('Pending')
    setIsModalVisible(true)
    try {
      await changePassword(newPassword, oldPassword)
        .then(res => {
          setPasswordChangeStatus('Success')
        })
    } catch (error) {
      setpasswordChangeError(`${error}`)
      setPasswordChangeStatus('Failed')
    }
  }

  const handleResetWallet = async () => {
    await removeItem({ key: INSTALL_STATE })
    await removeItem({
      key: PASSWORD
    })
    await removeItem({ key: CURRENT_ACCOUNT })
    setdeleteWalletState('Deleted')
  }

  return (
    <ScrollView style={styles.settingsContainer}>
      {/* change password form */}
      <View>
        <Text style={{ fontSize: actuatedNormalize(18), fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>Change password</Text>
        <Text style={{ fontFamily: fontsLoaded ? 'Poppins_400Regular' : '', color: COLORS.BLACK }}>
          Set a new password for your wallet. Provide old password to set a new one.
        </Text>
      </View>
      <View style={{ marginTop: actuatedNormalizeVertical(22), width: '100%' }}>

        <Text style={styles.textLabel}>Old Password</Text>
        <View style={{ flexDirection: 'row' }}>
          <TextInput

            onFocus={() => {
              setoldPasswordFocus(true)
            }}
            onBlur={() => setoldPasswordFocus((status) => !status)}
            onChangeText={(text) => {
              setoldPassword(text)
            }}
            placeholder='Old Password'
            placeholderTextColor={COLORS.WHITE004}
            style={[styles.textInput, { borderColor: oldPasswordFocus ? COLORS.ACCENT : COLORS.WHITE004 }]}
            secureTextEntry={secureOldPassword}
          />
          <Feather
            name={secureOldPassword ? "eye" : "eye-off"}
            size={24}
            onPress={() => {
              setsecureOldPassword((_secure) => !_secure)
            }}
            color={COLORS.BLACK_ACCENT}
            style={{ marginLeft: actuatedNormalize(-32), marginBottom: actuatedNormalizeVertical(40), marginTop: actuatedNormalizeVertical(10) }}
          />

        </View>
      </View>
      <View style={{ marginTop: actuatedNormalizeVertical(22), width: '100%' }}>
        <Text style={styles.textLabel}>New Password</Text>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            onFocus={() => {
              setNewPasswordFocus(true)
            }}
            onBlur={() => setNewPasswordFocus((toggle) => !toggle)}
            onChangeText={(text) => {
              setNewPassword(text)
            }}
            placeholder='New Password'
            placeholderTextColor={COLORS.WHITE004}

            style={[styles.textInput, { borderColor: newPasswordFocus ? COLORS.ACCENT : COLORS.WHITE004 }]}
            secureTextEntry={secureNewPassword}
          />
          <Feather
            name={secureNewPassword ? "eye" : "eye-off"}
            size={24}
            onPress={() => {
              setsecureNewPassword((secure) => !secure)
            }}
            color={COLORS.BLACK_ACCENT}
            style={{ marginLeft: actuatedNormalize(-32), marginBottom: actuatedNormalizeVertical(20), marginTop: actuatedNormalizeVertical(10), }}
          />
        </View>
        <Pressable
          disabled={oldPassword === '' && newPassword === ''}
          onPress={async () => (await handlePasswordChange())}
          style={[styles.changePasswordButton, { opacity: oldPassword !== '' && newPassword !== '' ? 1 : 0.6 }]}>
          <Text style={styles.buttonText}>
            Change
          </Text>
        </Pressable>
      </View>

      {/* Modal: Change Password */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalViewRoot}>
          <View style={styles.modalView}>
            <View style={styles.animatedImageContainer}>
              <Image
                source={passwordChangeStates[passwordChangeState].icon}
                style={{ height: actuatedNormalizeVertical(151.22), width: actuatedNormalizeVertical(129.32) }}
              />
            </View>
            <View style={styles.messageContainer}>
              <Text style={[styles.messageTitle, { fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }]}>
                {passwordChangeStates[passwordChangeState].title}
              </Text>
              {passwordChangeState === 'Failed' ? (
                <Text style={[styles.messageText, { fontFamily: fontsLoaded ? 'Poppins_400Regular' : '' }]}>
                  {passwordChangeError}
                </Text>
              ) : (<Text style={[styles.messageText]}>
                {passwordChangeStates[passwordChangeState].message}
              </Text>
              )}
            </View>
            <View style={styles.actionButtonContainer}>
              <Pressable
                style={styles.actionButtton}
                onPress={() => {
                  setIsModalVisible((status) => !status)
                  setPasswordChangeStatus('Pending')
                }}
              >
                <Text style={{ color: COLORS.WHITE, fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>Back</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>


      {/* Modal: Delete Wallet */}
      <Modal isVisible={isDeleteModalVisible}>
        <View style={styles.modalViewRoot}>
          <View style={styles.modalView}>
            <View style={styles.animatedImageContainer}>
              <Image
                source={deleteWalletStatus[deleteWalletState].icon}
                style={{ height: actuatedNormalizeVertical(151.22), width: actuatedNormalizeVertical(129.32) }}
              />
            </View>
            <View style={styles.messageContainer}>
              <Text style={[styles.messageTitle, { fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }]}>
                {deleteWalletStatus[deleteWalletState].title}
              </Text>
              {passwordChangeState === 'Failed' ? (
                <Text style={[styles.messageText, { fontFamily: fontsLoaded ? 'Poppins_400Regular' : '' }]}>
                  {passwordChangeError}
                </Text>
              ) : (<Text style={[styles.messageText]}>
                {deleteWalletStatus[deleteWalletState].message}
              </Text>
              )}
            </View>
            <View style={styles.actionButtonContainer}>
              {deleteWalletState === 'Pending' ? (
                <Pressable
                  style={[styles.actionButtton, { backgroundColor: COLORS.DANGER }]}
                  onPress={async () => {
                    setPasswordChangeStatus('Pending')
                    await handleResetWallet()
                  }}
                >
                  <Text style={{ color: COLORS.WHITE, fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>Confirm</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.actionButtton}
                  onPress={() => {
                    setIsModalVisible((status) => !status)
                    setPasswordChangeStatus('Pending')
                    router.replace('/create-new-wallet')
                  }}
                >
                  <Text style={{ color: COLORS.WHITE, fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>Exit</Text>
                </Pressable>
              )}
              {deleteWalletState === 'Pending' ? (
                <Pressable
                  style={[styles.actionButtton, { marginTop: actuatedNormalizeVertical(20), backgroundColor: COLORS.ACCENT }]}
                  onPress={async () => {
                    setPasswordChangeStatus('Pending')
                    setIsDeleteWalletModalVisible(false)
                  }}
                >
                  <Text style={{ color: COLORS.WHITE, fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>Back</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  )
}

export default Settings

const styles = StyleSheet.create({
  settingsContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingTop: actuatedNormalize(20),
    paddingStart: actuatedNormalize(20),
    paddingEnd: actuatedNormalize(20),

    paddingBottom: actuatedNormalizeVertical(100)
  },
  textLabel: {
    marginBottom: 2,
    color: COLORS.BLACK,
    fontWeight: '500',
    fontSize: actuatedNormalize(16)
  },
  textInput: {
    width: '100%',
    fontSize: actuatedNormalize(16),
    height: actuatedNormalizeVertical(50),
    borderStyle: 'solid',
    borderWidth: 1,
    paddingStart: actuatedNormalize(20),
    borderRadius: actuatedNormalize(7),
  },
  headingText: {
    color: COLORS.BLACK,
    fontWeight: '600',
    fontSize: actuatedNormalize(18),
    marginBottom: actuatedNormalize(15)
  },
  changePasswordButton: {
    height: actuatedNormalizeVertical(42),
    marginTop: actuatedNormalizeVertical(29),
    maxWidth: actuatedNormalize(110),
    backgroundColor: COLORS.BLACK_ACCENT,
    borderRadius: actuatedNormalize(11),
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    marginBottom: actuatedNormalizeVertical(15),
    fontSize: actuatedNormalize(16),
    fontWeight: '400',
    color: COLORS.BLACK
  },
  buttonText: {
    color: COLORS.WHITE,
    fontWeight: '600',
    fontSize: actuatedNormalize(16)
  },
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
