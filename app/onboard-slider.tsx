import { COLORS } from '@/app/COLORS'
import { useFonts } from 'expo-font'
import { router } from 'expo-router'
import React from 'react'
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text, View
} from 'react-native'

import AppIntroSlider from 'react-native-app-intro-slider'

import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'
import {
  actuatedNormalize,
  actuatedNormalizeVertical
} from '@/components/Dimension'

type SlideItem = {
  item: {
    key: string
    title: string
    text: string
    image: any
    backgroundColor: string
  }
}

const slides = [
  {
    key: 'one',
    title: 'Research and select a wallet',
    text: 'Start by researching different cryptocurrency wallets available in the market. Consider factors such as security.',
    image: require('@/assets/stepOne.png'),
    backgroundColor: '#fff',
  },
  {
    key: 'two',
    title: 'Manage all your assets in one place',
    text: 'Seamlessly manage all your assets in one secure place',
    image: require('@/assets/stepTwo.png'),
    backgroundColor: '#fff',
  },
  {
    key: 'three',
    title: 'Keep your wallet app up to date',
    image: require('@/assets/stepThree.png'),
    text: 'Regularly update your wallet software to ensure you have the latest security patches and bug fixes.',
    backgroundColor: '#fff',
  }
]

interface IOnboardSliderProps {
  onLayout: (event: LayoutChangeEvent) => void
}

const OnboardSlider = ({ onLayout }: IOnboardSliderProps) => {

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_300Light,
    Poppins_700Bold,
  })

  const renderNextButton = () => {
    return (
      <View style={styles.onboardButtonContainer}>
        <View style={styles.onboardButton}>
          <Text style={[styles.onboardButtonText, { fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }]}>Continue</Text>
        </View>
      </View>
    )
  }

  const renderDoneButton = () => {
    return (
      <View style={styles.onboardButtonContainer}>
        <View style={styles.onboardButton}>
          <Text style={[styles.onboardButtonText, { fontFamily: 'Poppins_500Medium' }]}>Get Started</Text>
        </View>
      </View>
    )
  }

  const onSkipSlider = () => {
    router.replace('/(app)/create-new-wallet')
  }

  // @todo: render as pagination in order to customize the slider dots position to 'absolute'
  const renderSlides = ({ item }: SlideItem) => {
    return (
      <View onLayout={onLayout}>
        <View style={styles.skipContainer}>
          <Pressable onPress={onSkipSlider}>
            <Text style={[styles.skippButtonText, { fontFamily: fontsLoaded ? 'Poppins_300Light' : '' }]}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} />
        </View>
        <View style={styles.onboardTextContainer}>
          <Text style={[styles.onboardHeading, { fontFamily: fontsLoaded ? 'Poppins_700Bold' : '' }]}>
            {item.title}
          </Text>
          <Text style={[styles.onboardingText, { fontFamily: fontsLoaded ? 'Poppins_400Regular' : '' }]}>
            {item.text}
          </Text>
        </View>
      </View>
    )
  }

  const onDone = () => {
    router.replace('/(app)/create-new-wallet')
  }

  return (
    <AppIntroSlider
      style={{ backgroundColor: COLORS.WHITE }}
      renderItem={renderSlides}
      data={slides}
      onDone={onDone}
      activeDotStyle={styles.activeDotStyle}
      dotStyle={styles.dotStyle}
      renderNextButton={renderNextButton}
      renderDoneButton={renderDoneButton}
    />
  )
}

export default OnboardSlider

const styles = StyleSheet.create({
  onboardTextContainer: {
    marginTop: actuatedNormalizeVertical(10),
    marginLeft: actuatedNormalize(20),
    marginRight: actuatedNormalize(70),
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  image: {
    width: actuatedNormalize(342),
    // marginLeft: actuatedNormalize(22),
    // marginRight: 11,
    resizeMode: 'contain',
    height: actuatedNormalizeVertical(300)
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: actuatedNormalizeVertical(30)
  },
  onboardHeading: {
    color: COLORS.BLACK_ACCENT,
    marginTop: actuatedNormalizeVertical(10),
    fontWeight: 'bold',
    fontSize: actuatedNormalize(28),
    fontFamily: 'Poppins_700Bold'
  },
  onboardingText: {
    color: COLORS.BLACK,
    marginTop: actuatedNormalizeVertical(10),
    fontSize: actuatedNormalize(16),
    fontFamily: 'Poppins_400Regular'
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: actuatedNormalizeVertical(40),
    marginRight: actuatedNormalize(20),
  },
  skippButtonText: {
    color: COLORS.WHITE002,
    fontFamily: 'Poppins_300Light'
  },
  onboardButton: {
    backgroundColor: COLORS.BLACK_ACCENT,
    width: actuatedNormalize(140),
    height: actuatedNormalizeVertical(50),
    borderRadius: actuatedNormalize(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardButtonContainer: {
    marginTop: actuatedNormalizeVertical(-45),
  },
  onboardButtonText: {
    color: COLORS.WHITE,
    fontSize: actuatedNormalize(16),
  },
  // ref: https://github.com/Jacse/react-native-app-intro-slider
  activeDotStyle: {
    width: actuatedNormalize(15),
    height: actuatedNormalizeVertical(7),
    borderColor: COLORS.ACCENT,
    borderWidth: actuatedNormalize(2),
    borderRadius: 15
  },
  dotStyle: {
    height: actuatedNormalizeVertical(8),
    width: actuatedNormalize(8),
    backgroundColor: '#EAEAEA'
  }
})