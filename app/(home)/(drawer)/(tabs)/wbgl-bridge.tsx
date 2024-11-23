import { COLORS } from '@/app/COLORS'
import {
  actuatedNormalize,
  actuatedNormalizeVertical
} from '@/components/Dimension'
import {
  Poppins_500Medium,
  Poppins_600SemiBold,
  useFonts
} from '@expo-google-fonts/poppins'
import React from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'

const WBGLBrigdge = () => {

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold
  })

  return (
    <ScrollView style={styles.wbglBridgeContainer}>
      <View style={{ width: '100%' }}>
        <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', marginBottom: actuatedNormalizeVertical(8), marginTop: actuatedNormalize(15) }}>
          Swap WBGL for BGL
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '100%', backgroundColor: '#50AF95', height: actuatedNormalizeVertical(135), borderRadius: actuatedNormalize(20), padding: actuatedNormalize(20) }}>
            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}>Send</Text>
            <Text>1000 WBGL</Text>
          </View>
          <View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {/* <Image source={require('@/assets/swap.png')} style={{ height: actuatedNormalize(61), width: actuatedNormalize(61) }} /> */}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: actuatedNormalize(0) }}>
          <View style={{ width: '100%', backgroundColor: COLORS.ACCENT, height: actuatedNormalizeVertical(110), borderRadius: actuatedNormalize(20), padding: actuatedNormalize(28) }}>
            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}>Receive BGL:</Text>
            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}>0 BGL</Text>
          </View>
          <View>
          </View>
        </View>
        <View style={{ height: actuatedNormalizeVertical(60), width: actuatedNormalize(335), backgroundColor: '#F5F5F5', borderRadius: actuatedNormalize(10), marginTop: actuatedNormalize(15), justifyContent: 'space-between', alignItems: 'center', paddingStart: actuatedNormalize(23), paddingEnd: actuatedNormalize(23), flexDirection: 'row' }}>
          <Text style={{ fontSize: 12, color: '#888888', fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }}>Available Portfolio</Text>
          <Text style={{ fontSize: 16, color: COLORS.BLACK, fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }}>17000 BGL</Text>

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: actuatedNormalize(35) }}>
          <Pressable style={{ height: actuatedNormalize(50), width: actuatedNormalize(230), backgroundColor: COLORS.ACCENT, justifyContent: 'center', alignItems: 'center', borderRadius: actuatedNormalize(11) }}>
            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}>Swap</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  )
}

export default WBGLBrigdge
const styles = StyleSheet.create({
  wbglBridgeContainer: {
    flex: 1,
    padding: actuatedNormalize(20),
    backgroundColor: COLORS.WHITE
  }
})