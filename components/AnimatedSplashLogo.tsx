import { COLORS } from '@/app/COLORS'
import {
  Text,
  View,
  Image,
  StyleSheet
} from 'react-native'
import { actuatedNormalize, actuatedNormalizeVertical } from './Dimension'

const AnimatedSplashLogo = () => {
  return (
    <View style={styles.loaderContainer}>
      <Image source={require('@/assets/logo.png')} style={{
        height: 50,
        width: 50
      }} />
    </View>
  )
}
export default AnimatedSplashLogo

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})