
import AnimatedSplashLogo from '@/components/AnimatedSplashLogo'
import {
  actuatedNormalize,
  actuatedNormalizeVertical
} from '@/components/Dimension'
import { Poppins_500Medium } from '@expo-google-fonts/poppins'
import { COLORS } from 'app/COLORS'
import { useFonts } from 'expo-font'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import {
  LayoutChangeEvent,
  StyleSheet,
  View,
  Image
} from 'react-native'
import {
  APP_INSTALL_STATE,
  retrieveAppInstallState
} from './utils'

interface Props {
  onLayout: ((event: LayoutChangeEvent) => void)
}

export default function WelcomeSplash({ onLayout }: Props) {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium
  })

  useEffect(() => {
    async function getAppState() {
      const [installState] = await Promise.all([
        retrieveAppInstallState(),
      ])

      if (installState === APP_INSTALL_STATE.installed) {
        setTimeout(() => {
          router.replace('/open-wallet/')
        }, 4 * 1000);
      } else {
        setTimeout(() => {
          router.replace('/onboard-slider')
        }, 4 * 1000);
      }
    }
    getAppState()
  }, [])

  return (
    <>
      <StatusBar backgroundColor={COLORS.ACCENT} style='light' />
      <View style={styles.welcomeContainer} onLayout={onLayout}>
        <View style={styles.viewLogoContainer}>
          <AnimatedSplashLogo />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  welcomeContainer: {
    backgroundColor: COLORS.ACCENT,
    flex: 1
  },
  viewLogoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    flex: 0.3,
    marginBottom: actuatedNormalizeVertical(231),
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcomeText: {
    color: COLORS.WHITE,
    fontSize: actuatedNormalize(16),
  },

})