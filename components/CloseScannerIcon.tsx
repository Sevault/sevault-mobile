import { SvgXml } from 'react-native-svg'

interface ICloseScannerIcon {
  onPress: () => void
}

export default function CloseScannerIcon({ onPress }: ICloseScannerIcon) {
  const logoSvgMarkup = `
<svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="82" height="82" fill="#F5F5F5"/>
<rect width="375" height="812" transform="translate(-147 -632)" fill="white"/>
<circle cx="41" cy="41" r="35" fill="#FFBA0A"/>
<circle cx="41" cy="41" r="40.25" fill="#FFBA0A" stroke="url(#paint0_linear_14_18)" stroke-width="1.5"/>
<path d="M48.8338 37.1665L37.1671 48.8332M37.1671 37.1665L48.8338 48.8332" stroke="#F5F5F5" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_14_18" x1="41" y1="82" x2="41" y2="14" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFBA0A"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} onPress={onPress} />
  return (
    <SVGLogo />
  )
}