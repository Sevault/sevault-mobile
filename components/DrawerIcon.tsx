

import { SvgXml } from 'react-native-svg'

interface DrawerIconProps {
  onpress: () => void
}
export default function DrawerIcon(
  {
    onpress
  }: DrawerIconProps) {
  const logoSvgMarkup = `
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" rx="20" fill="#F5F5F5"/>
<path d="M15.7857 14L25.0714 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13 20.5L27.8571 20.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.7857 27L25.0714 27" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} onPress={onpress} />
  return (
    <SVGLogo />
  )
}

