import { SvgXml } from 'react-native-svg'

export default function ReceiveBGLIcon() {
  const logoSvgMarkup = `
  <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="65" height="65" fill="#F5F5F5"/>
<g clip-path="url(#clip0_14_18)">
<rect width="375" height="870" transform="translate(-147 -278)" fill="white"/>
<g filter="url(#filter0_d_14_18)">
<path d="M-147 -232H228V-20C228 27.1404 228 50.7107 213.355 65.3553C198.711 80 175.14 80 128 80H-47C-94.1405 80 -117.711 80 -132.355 65.3553C-147 50.7107 -147 27.1404 -147 -20V-232Z" fill="#FFBA0A"/>
</g>
<g filter="url(#filter1_d_14_18)">
<rect x="-127" y="-23" width="334" height="240" rx="24" fill="white"/>
</g>
<rect x="-102" y="6" width="299" height="196" fill="white"/>
<circle cx="32.5" cy="32.5" r="32.5" fill="#FFEB56" fill-opacity="0.25"/>
<path d="M34.0025 27.2588C32.6217 27.2588 31.5025 28.0983 31.5025 29.1338C31.5025 30.1693 32.6217 31.0088 34.0025 31.0088C35.3831 31.0088 36.5025 31.8483 36.5025 32.8838C36.5025 33.9193 35.3831 34.7588 34.0025 34.7588M34.0025 27.2588C35.091 27.2588 36.017 27.7805 36.3601 28.5088M34.0025 27.2588V26.0088M34.0025 34.7588C32.9139 34.7588 31.9879 34.2371 31.6447 33.5088M34.0025 34.7588V36.0088" stroke="#FFBA0A" stroke-linecap="round"/>
<path d="M35.25 19.1338C35.25 19.1338 34.8549 19.1338 34 19.1338C28.4021 19.1338 25.6031 19.1338 23.864 20.8729C22.125 22.6119 22.125 25.4109 22.125 31.0088C22.125 36.6067 22.125 39.4057 23.864 41.1448C25.6031 42.8838 28.4021 42.8838 34 42.8838C39.5979 42.8838 42.3969 42.8838 44.136 41.1448C45.875 39.4057 45.875 36.6067 45.875 31.0088C45.875 30.1539 45.875 29.7588 45.875 29.7588" stroke="#FFBA0A" stroke-linecap="round"/>
<path d="M45.8604 19.1162L40.6406 24.339M39.6104 19.7684L39.7581 23.6328C39.7581 24.5436 40.302 25.1111 41.2926 25.1826L45.1976 25.3662" stroke="#FFBA0A" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<filter id="filter0_d_14_18" x="-151" y="-232" width="383" height="320" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14_18"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14_18" result="shape"/>
</filter>
<filter id="filter1_d_14_18" x="-131" y="-23" width="342" height="248" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
<rect width="375" height="870" fill="white" transform="translate(-147 -278)"/>
</clipPath>
</defs>
</svg>

  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}