import {
  Poppins_600SemiBold
} from '@expo-google-fonts/poppins'

import { useFonts } from '@expo-google-fonts/poppins/useFonts'

import { COLORS } from '@/app/COLORS'
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'

interface IModalProps {
  animatedGIFPath?: string
  isModalVisible: boolean,
  message: string
  route?: string
  action: () => void
  actionTitle: string
  messageTitle: string
}

const FeedbackModal = ({
  animatedGIFPath,
  isModalVisible,
  message,
  route,
  action,
  actionTitle,
  messageTitle
}: IModalProps) => {

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  })

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        // setIsModalVisible((visible) => !visible)
      }}
    >
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
              {messageTitle}
            </Text>
            <Text style={[styles.messageText]}>
              {message}
            </Text>
          </View>
          <View style={styles.actionButtonContainer}>
            <Pressable
              style={styles.actionButtton}
              onPress={action}
            >
              <Text style={{ color: COLORS.WHITE, fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>{actionTitle}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default FeedbackModal

const styles = StyleSheet.create({
  modalViewRoot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    padding: 45,
    width: 335,
    height: 461,
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
    paddingBottom: 24,
    paddingLeft: 14,
    paddingRight: 14,
    fontSize: 18
  },
  messageText: {
    fontSize: 14,
    paddingBottom: 26
  },
  actionButtton: {
    width: 240,
    height: 50,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK_ACCENT
  }
})