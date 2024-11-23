import { SvgXml } from 'react-native-svg'

interface DrawerBackIconProps {
  onpress: () => void
}
export default function DrawerIcon(
  {
    onpress
  }: DrawerBackIconProps) {
  const logoSvgMarkup = `
  <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.83307 17.4998H29.1664" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.1244 24.7917C13.1244 24.7917 5.83285 19.4215 5.83282 17.5C5.83281 15.5785 13.1245 10.2084 13.1245 10.2084" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} onPress={onpress} />
  return (
    <SVGLogo />
  )
}

