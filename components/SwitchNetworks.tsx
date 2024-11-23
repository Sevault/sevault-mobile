import { View, Text } from 'react-native'
import { SvgXml } from 'react-native-svg'

export default function SwitchNetworks() {
    const logoSvgMarkup = `
    <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="65" height="65" fill="#F5F5F5"/>
<g clip-path="url(#clip0_14_18)">
<rect width="375" height="870" transform="translate(-247 -278)" fill="white"/>
<g filter="url(#filter0_d_14_18)">
<path d="M-247 -232H128V-20C128 27.1404 128 50.7107 113.355 65.3553C98.7107 80 75.1404 80 28 80H-147C-194.14 80 -217.711 80 -232.355 65.3553C-247 50.7107 -247 27.1404 -247 -20V-232Z" fill="#FFBA0A"/>
</g>
<g filter="url(#filter1_d_14_18)">
<rect x="-227" y="-23" width="334" height="240" rx="24" fill="white"/>
</g>
<rect x="-202" y="6" width="299" height="196" fill="white"/>
<circle cx="32.5" cy="32.5" r="32.5" fill="#96FF56" fill-opacity="0.25"/>
<path d="M30.75 31C30.75 33.0711 29.0711 34.75 27 34.75C24.9289 34.75 23.25 33.0711 23.25 31C23.25 28.9289 24.9289 27.25 27 27.25C29.0711 27.25 30.75 28.9289 30.75 31Z" stroke="#0AFF22"/>
<path d="M37 23.5H27C22.8579 23.5 19.5 26.8579 19.5 31C19.5 35.1421 22.8579 38.5 27 38.5H37C41.1421 38.5 44.5 35.1421 44.5 31C44.5 26.8579 41.1421 23.5 37 23.5Z" stroke="#0AFF22"/>
</g>
<defs>
<filter id="filter0_d_14_18" x="-251" y="-232" width="383" height="320" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14_18"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14_18" result="shape"/>
</filter>
<filter id="filter1_d_14_18" x="-231" y="-23" width="342" height="248" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14_18"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14_18" result="shape"/>
</filter>
<clipPath id="clip0_14_18">
<rect width="375" height="870" fill="white" transform="translate(-247 -278)"/>
</clipPath>
</defs>
</svg>

    `

    const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
    return (
        <SVGLogo />
    )
}