import { SvgXml } from 'react-native-svg'

interface SendBGLProps {
  onPress: () => void
}
export default function SendBGL({
  onPress
}: SendBGLProps) {
  const logoSvgMarkup = `
  <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="65" height="65" fill="#F5F5F5"/>
<g clip-path="url(#clip0_14_18)">
<rect width="375" height="870" transform="translate(-52 -276)" fill="white"/>
<g filter="url(#filter0_d_14_18)">
<path d="M-52 -230H323V-18C323 29.1404 323 52.7107 308.355 67.3553C293.711 82 270.14 82 223 82H48C0.859547 82 -22.7107 82 -37.3553 67.3553C-52 52.7107 -52 29.1404 -52 -18V-230Z" fill="#FFBA0A"/>
</g>
<g filter="url(#filter1_d_14_18)">
<rect x="-32" y="-21" width="334" height="240" rx="24" fill="white"/>
</g>
<rect x="-7" y="8" width="299" height="196" fill="white"/>
<circle cx="32.5" cy="32.5" r="32.5" fill="#824FF4" fill-opacity="0.08"/>
<path d="M32.0025 29.2512C30.6218 29.2512 29.5025 30.0907 29.5025 31.1262C29.5025 32.1617 30.6218 33.0012 32.0025 33.0012C33.3831 33.0012 34.5025 33.8407 34.5025 34.8762C34.5025 35.9117 33.3831 36.7512 32.0025 36.7512M32.0025 29.2512C33.091 29.2512 34.017 29.773 34.3601 30.5012M32.0025 29.2512V28.0012M32.0025 36.7512C30.9139 36.7512 29.9879 36.2295 29.6448 35.5012M32.0025 36.7512V38.0012" stroke="#824FF4" stroke-linecap="round"/>
<path d="M33.875 21.1262C33.875 21.1262 32.8549 21.1262 32 21.1262C26.4021 21.1262 23.6031 21.1262 21.864 22.8653C20.125 24.6043 20.125 27.4033 20.125 33.0012C20.125 38.5991 20.125 41.3981 21.864 43.1372C23.6031 44.8762 26.4021 44.8762 32 44.8762C37.5979 44.8762 40.3969 44.8762 42.136 43.1372C43.875 41.3981 43.875 38.5991 43.875 33.0012C43.875 32.1464 43.875 31.1262 43.875 31.1262" stroke="#824FF4" stroke-linecap="round"/>
<path d="M37.625 27.3738L42.8448 22.151M43.875 26.7216L43.7273 22.8572C43.7273 21.9464 43.1834 21.3789 42.1927 21.3074L38.2877 21.1238" stroke="#824FF4" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<filter id="filter0_d_14_18" x="-56" y="-230" width="383" height="320" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14_18"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14_18" result="shape"/>
</filter>
<filter id="filter1_d_14_18" x="-36" y="-21" width="342" height="248" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
<rect width="375" height="870" fill="white" transform="translate(-52 -276)"/>
</clipPath>
</defs>
</svg>
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} onPress={onPress} />
  return (
    <SVGLogo />
  )
}