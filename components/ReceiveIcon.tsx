import { View, Text } from 'react-native'
import { SvgXml } from 'react-native-svg'

export default function ReceiveIcon() {
    const logoSvgMarkup = `
    <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path d="M12.7934 16.9317L5.29336 3.94128" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
   <path d="M14.9858 8.68021L12.7938 16.9317L4.55103 14.7047" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `

    const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
    return (
        <SVGLogo />
    )
}