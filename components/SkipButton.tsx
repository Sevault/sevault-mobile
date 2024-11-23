import { COLORS } from '@/app/COLORS'
import { router } from 'expo-router'
import {Pressable, StyleSheet, View, Text} from 'react-native'
interface Props {
  route: string
}

const SkipButton = ({ route }: Props) => {
  return (
    <View style={styles.skipContainer}>
      <Pressable
      style={styles.skiptButton}
      onPress={() => {
        router.replace(route)
      }}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>
    </View>

  )
}

const styles = StyleSheet.create({
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 67,
    marginBottom: 82,
  },
  skiptButton: {
    height: 80,
    width: 80
  },
  skipText: {
    fontWeight: '600',
    color: COLORS.WHITE
  }
})

export default SkipButton