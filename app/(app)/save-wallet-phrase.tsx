import CustomBGLlogo from '@/components/CustomBGLlogo'
import { RootStateTree } from '@/features/store'
import {
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'
import { useFonts } from '@expo-google-fonts/poppins/useFonts'
import { COLORS } from 'app/COLORS'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import Toast from 'react-native-toast-message'
import {
  useDispatch,
  useSelector
} from 'react-redux'

import {
  APP_INSTALL_STATE,
  copyToClipboard,
  saveAppInstallState,
  setCurrentAccountInStorage
} from '@/app/utils'

import {
  actuatedNormalize,
  actuatedNormalizeVertical
} from '@/components/Dimension'

import displayToast from '@/components/Toast'
import Modal from 'react-native-modal'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as MediaLibrary from 'expo-media-library'
import * as FileSystem from 'expo-file-system'

export interface IwalletBackup {
  bnb: {
    address: string;
    privateKey: string;
  };
  bgl: {
    seedphrase: string,
    address: string;
    privateKey: string;
  };
  eth: {
    address: string;
    privateKey: string;
  };
}

export const saveWalletBackupDevice = async (walletBackup: IwalletBackup) => {
  // copyToClipboard(walletBackup.bgl.seedphrase)
  console.log(walletBackup)
  const content = JSON.stringify(walletBackup)
  const fileName = 'sevault.txt'

  try {
    const backupFolderUri = FileSystem.documentDirectory
    const fileUri = `${backupFolderUri}/${fileName}`;
    const existingBackupFileInfo = await FileSystem.getInfoAsync(fileUri)


    if (existingBackupFileInfo.exists) {
      Alert.alert(
        'File Exists',
        'A file with this name already exists. Do you want to overwrite it?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Overwrite',
            onPress: async () => {
              await FileSystem.writeAsStringAsync(fileUri, content)
              displayToast({ type: 'info', message: `File overwritten at ${fileUri}` })
            },
          },
        ]
      );
    } else {
      await FileSystem.writeAsStringAsync(fileUri, content)
      displayToast({ type: 'info', message: `Wallet backup saved at ${fileUri}}` })
    }
  } catch (error) {
    displayToast({ message: 'Failed to create wallet backup', type: 'info' })
  }
}

const SaveSeedPhrase = () => {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold
  })

  const dispatch = useDispatch()

  const wallet = useSelector((state: RootStateTree) => state.wallet.walletObject)
  const walletBackup = useSelector((state: RootStateTree) => state.wallet.walletBackup)

  const [showModal, setShowModal] = useState<boolean>(false)

  const [isLongpress, setIsLongpress] = React.useState<boolean>(false)
  const [acceptSeedphraseConditions, setAcceptSeedphraseConditions] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const handleCompleteInstallation = async () => {
    await saveAppInstallState(APP_INSTALL_STATE.installed)
    setIsModalVisible(false)
    router.replace('/(tabs)/home/')
  }

  const handleSaveWalletBackup = async () => {
    await saveWalletBackupDevice(walletBackup)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.createWalletContainer, { opacity: showModal ? 0.05 : 1 }]}>
        <StatusBar backgroundColor={COLORS.ACCENT} style="light" />
        <View style={{ marginBottom: 25, justifyContent: 'center', alignItems: 'center' }}>
          <CustomBGLlogo />
        </View>

        <View style={styles.walletTextContainer}>
          <Text style={[styles.walletContainerHeading, { fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }]}>
            Back Up
            Seedphrase
          </Text>
          <Text style={styles.walletText}>
            Create a new  Bitgesell Wallet to  manage all your
            BGL and other assets
          </Text>
        </View>
        <View style={styles.createWalletForm}>
          <Text style={[styles.inputLabel, { fontFamily: fontsLoaded ? 'Poppins_400Regular' : '' }]}>
            Your Bitgesell Secret Phrase/Mnemonic
          </Text>
          <View style={{ width: '100%', flexDirection: 'row' }}>
            <TextInput
              editable={false}
              value={wallet.mnemonic}
              style={styles.passwordInput}
              multiline={true}
              autoCorrect={false}
            />
            <Pressable
              onPress={() => {
                handleSaveWalletBackup()
              }}
              style={{ marginLeft: actuatedNormalize(-60), marginTop: actuatedNormalizeVertical(14) }}>
              <Text style={{ color: COLORS.ACCENT, fontWeight: 'bold' }}>Save</Text>
            </Pressable>
          </View>

          <Text style={[styles.walletText, { fontFamily: fontsLoaded ? 'Poppins_400Regular' : '' }]}>
            🔒 Important: Backup Your Seed Phrase!
            Secure your account:
            Write down and store your seed phrase in a safe place. It's your key to account recovery.
          </Text>
          <View style={{ paddingBottom: 25, paddingEnd: 20, maxWidth: '90%' }}>
            <BouncyCheckbox
              size={25}
              fillColor={COLORS.ACCENT}
              text="I understand Sevault Wallet can not recover this seedphrase for me."
              iconStyle={{
                borderColor: "red",
                borderRadius: 0
              }}
              innerIconStyle={{
                borderRadius: 0
              }}
              textStyle={{
                fontSize: actuatedNormalize(16),
                textDecorationLine: 'none',
                color: COLORS.BLACK
              }}
              onPress={(isChecked: boolean) => {
                setAcceptSeedphraseConditions((isChecked) => !isChecked)
              }}
            />
          </View>
          <View style={styles.submitButtonContainer}>
            <Pressable style={[styles.submitButton, { opacity: acceptSeedphraseConditions ? 1 : 0.6 }]}
              disabled={(!acceptSeedphraseConditions)}
              onPress={() => {
                // router.push('/(home)/')
                setIsLongpress(true)
                setIsModalVisible(true)
                setCurrentAccountInStorage(wallet)
              }}>
              <Text style={styles.submitButtonText}>I have backed up seedphrase</Text>
            </Pressable>
          </View>
        </View>
        <Toast />

        {/* Modal */}
        <Modal isVisible={isModalVisible}>
          <View style={styles.modalViewRoot}>
            <View style={styles.modalView}>
              <View style={styles.animatedImageContainer}>
                <Image
                  source={require('@/assets/success_confetti.png')}
                  style={{ height: actuatedNormalizeVertical(151.22), width: actuatedNormalizeVertical(129.32) }}
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
                  onPress={handleCompleteInstallation}
                >
                  <Text style={{ color: COLORS.WHITE, fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>Back to Home</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  )
}

export default SaveSeedPhrase

const styles = StyleSheet.create({
  createWalletContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: actuatedNormalize(20),
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
    paddingBottom: actuatedNormalizeVertical(22)
  },
  walletText: {
    color: COLORS.BLACK,
    fontSize: actuatedNormalize(16),
    paddingBottom: actuatedNormalizeVertical(24)
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
    justifyContent: 'center',
    paddingEnd: actuatedNormalize(10),
    color: COLORS.BLACK
  },

  inputLabel: {
    color: COLORS.BLACK,
    fontSize: actuatedNormalize(14),
    fontWeight: '700',
  },
  passwordInput: {
    width: '100%',
    borderRadius: 7,
    fontSize: actuatedNormalize(16),
    fontWeight: '600',
    height: actuatedNormalizeVertical(120),
    color: COLORS.BLACK,
    paddingLeft: actuatedNormalize(20),
    paddingRight: actuatedNormalize(20),
    borderColor: COLORS.ACCENT,
    borderStyle: 'solid',
    borderWidth: .8,
    borderTopColor: COLORS.WHITE,
    borderEndColor: COLORS.WHITE,
    borderLeftColor: COLORS.WHITE,
    borderRightColor: COLORS.WHITE,
    marginBottom: actuatedNormalizeVertical(15),
    marginTop: actuatedNormalizeVertical(10)
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
    fontWeight: '600'
  },
  submitButtonContainer: {
    // marginTop: 158
    width: '100%'
  }
})