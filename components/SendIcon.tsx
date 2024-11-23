import { View, Text } from 'react-native'
import { SvgXml } from 'react-native-svg'

export default function SendIcon() {
    const logoSvgMarkup = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.3466 5.13335L4.73995 15.74" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
   <path d="M6.80881 5.15134L15.3464 5.13295L15.3287 13.6713" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
   </svg>
    `

    const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
    return (
        <SVGLogo />
    )
}