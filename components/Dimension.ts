import {
  Dimensions,
  Platform,
  PixelRatio
} from 'react-native'

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT
} = Dimensions.get('window')

const scale = SCREEN_WIDTH / 375 // refference number for iPhone 6/7/8
const scaleVertical = SCREEN_HEIGHT / 812 // iPad

export function actuatedNormalize(size: number) {
  const newSize = size * scale
  if (Platform.OS == 'ios') return Math.round(PixelRatio.roundToNearestPixel(newSize))
  else return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1
}

export function actuatedNormalizeVertical(size: number) {
  const newSize = size * scaleVertical
  if (Platform.OS === 'ios') return Math.round(PixelRatio.roundToNearestPixel(newSize))
  else return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1
}

export const isTab = () => SCREEN_WIDTH > 550 ? true : false

export const isScreenHeight770 = () => SCREEN_HEIGHT > 740 && SCREEN_HEIGHT < 760 ? true : false
