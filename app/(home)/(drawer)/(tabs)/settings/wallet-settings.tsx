import React, { useEffect, useState } from 'react'
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

import Modal from 'react-native-modal'
import { changePassword } from '@/app/utils'
import Feather from '@expo/vector-icons/Feather'
import {
  INSTALL_STATE,
  PASSWORD,
  CURRENT_ACCOUNT
} from '@/app/storage/keys'

import { router, Stack, useNavigation } from 'expo-router'
import { removeItem } from '@/app/storage/removeItem'
import DrawerBackIcon from '@/components/DrawerBackIcon'

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


  const navigation = useNavigation()
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_400Regular
  })

  const [passwordChangeError, setpasswordChangeError] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [passwordChangeState, setPasswordChangeStatus] = useState<PasswordChangeState>('Pending')

  const [deleteWalletState, setdeleteWalletState] = useState<DeleteWalletStates>('Pending')
  const [isDeleteModalVisible, setIsDeleteWalletModalVisible] = useState(false)

  const handleResetWallet = async () => {
    await removeItem({ key: INSTALL_STATE })
    await removeItem({
      key: PASSWORD
    })
    await removeItem({ key: CURRENT_ACCOUNT })
    setdeleteWalletState('Deleted')
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Wallet Settings`,
      headerTitleAlign: 'center',
      backBehavior: 'history',
      // goBack hack: goBack doesn't work: so we push previous route+initial params
      headerLeft: () => (
        <View style={{ marginLeft: actuatedNormalize(19) }}>
          <DrawerBackIcon onpress={() => router.back()} />
        </View>)
    });
  })

  return (
    <ScrollView style={styles.settingsContainer}>
      {/* Reveal Seed Phrase */}
      <View style={{ marginTop: actuatedNormalizeVertical(20) }}>
        <Text style={{ fontSize: actuatedNormalize(18), fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>
          Reveal Wallet seedphrase/private key
        </Text>
        <Text style={{ fontFamily: fontsLoaded ? 'Poppins_400Regular' : '', color: COLORS.BLACK }}>
          View Seedphrase for current account(s) or private key
        </Text>
        <Pressable
          onPress={() => {
            router.push('(tabs)/view-seed')
          }}
          style={{ backgroundColor: COLORS.BLACK_ACCENT, height: actuatedNormalize(42), marginTop: actuatedNormalizeVertical(10), width: actuatedNormalize(200), alignItems: 'center', justifyContent: 'center', borderRadius: 11 }}>
          <Text style={styles.buttonText}>
            View Wallet Private Key
          </Text>
        </Pressable>
        <Text style={{ fontFamily: fontsLoaded ? 'Poppins_400Regular' : '', color: COLORS.DANGER, marginTop: actuatedNormalize(10) }}>
          Note: Always Keep Private Key secure as exposing could lead to loss of assets.
        </Text>
      </View>


      {/* Import Wallets */}
      <View style={{ marginTop: actuatedNormalizeVertical(77) }}>
        <Text style={{ fontSize: actuatedNormalize(18), fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>
          Import Wallets
        </Text>
        <Text style={{ color: COLORS.BLACK, marginTop: actuatedNormalizeVertical(10), fontFamily: fontsLoaded ? 'Poppins_400Regular' : '' }}>
          Import Bitgesell, BSC Chain and Etherum wallets from private keys.
        </Text>
        <Pressable
          onPress={() => {
          }}
          style={{ backgroundColor: COLORS.BLACK_ACCENT, height: actuatedNormalize(42), marginTop: actuatedNormalize(10), width: actuatedNormalize(174), alignItems: 'center', justifyContent: 'center', borderRadius: 11 }}>
          <Text style={styles.buttonText}>
            Import a Wallet
          </Text>
        </Pressable>
      </View>
      {/* import wallet from seedphrase- BNB/BGL/ETHEREUM-> redirect to wallet view */}

      {/* Reset Walle/Delete Wallet */}
      <View style={{ marginBottom: actuatedNormalizeVertical(77), marginTop: actuatedNormalizeVertical(77), }}>
        <Text style={{ fontSize: actuatedNormalize(18), fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>
          Reset Wallet
        </Text>
        <Text style={{ fontFamily: fontsLoaded ? 'Poppins_400Regular' : '', color: COLORS.BLACK }}>
          Delete wallet and create an new account
        </Text>
        <Pressable
          onPress={() => {
            setIsDeleteWalletModalVisible(true)
          }}
          style={{ backgroundColor: COLORS.DANGER, height: actuatedNormalize(42), marginTop: actuatedNormalize(10), width: actuatedNormalize(174), alignItems: 'center', justifyContent: 'center', borderRadius: 11 }}>
          <Text style={styles.buttonText}>
            Delete Wallet
          </Text>
        </Pressable>
        <Text style={{ opacity: 0.66, color: COLORS.DANGER, marginTop: actuatedNormalizeVertical(10), fontFamily: fontsLoaded ? 'Poppins_400Regular' : '' }}>
          Note: this removes the current accounts and may only restored throught the backed up seedphrase. Be sure to backup your wallet before proceeding with this action.
        </Text>
      </View>
      {/* Modal: Change Password */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalViewRoot}>
          <View style={styles.modalView}>
            <View style={styles.animatedImageContainer}>
              <Image
                source={passwordChangeStates[passwordChangeState].icon}
                style={{ height: actuatedNormalizeVertical(80), width: actuatedNormalizeVertical(80) }}
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
                style={{ height: actuatedNormalizeVertical(80), width: actuatedNormalize(80) }}
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
