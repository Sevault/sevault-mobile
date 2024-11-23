
import { SvgXml } from 'react-native-svg'

export default function IconRightSM() {
  const logoSvgMarkup = `
<svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L5 5L1 9" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg> 
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}