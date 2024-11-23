import { SvgXml } from 'react-native-svg'

interface MoreIconProps {
  onpress: () => void
}

export default function MoreIcon(
  {
    onpress
  }: MoreIconProps) {
  const logoSvgMarkup = `
  <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="34" height="34" rx="9.5" stroke="#AAAAAA"/>
<path d="M17.0082 17.4615H17.0179" stroke="#888888" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.9998 23.9231H17.0095" stroke="#888888" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.0166 11H17.0263" stroke="#888888" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} onPress={onpress} />
  return (
    <SVGLogo />
  )
}

