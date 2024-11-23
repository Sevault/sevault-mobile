import { SvgXml } from 'react-native-svg'

export default function BridgeIcon() {
  const logoSvgMarkup = `
  <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="65" height="65" fill="#F5F5F5"/>
<g clip-path="url(#clip0_14_18)">
<rect width="375" height="870" transform="translate(-246 -373)" fill="white"/>
<g filter="url(#filter0_d_14_18)">
<rect x="-226" y="-118" width="334" height="240" rx="24" fill="white"/>
</g>
<rect x="-201" y="-89" width="299" height="196" fill="white"/>
<circle cx="32.5" cy="32.5" r="32.5" fill="#07A00D" fill-opacity="0.06"/>
<path d="M22.75 24.75C23.375 24.75 25.25 24.125 26.5 22.25C27.75 24.125 30.25 27.25 34 27.25C37.75 27.25 40.25 24.125 41.5 22.25C42.75 24.125 44.625 24.75 45.25 24.75" stroke="#07A00D" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M26.5 21V41" stroke="#07A00D" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.5 36H46.5" stroke="#07A00D" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M41.5 21V41" stroke="#07A00D" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M31.5 27.25V36" stroke="#07A00D" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M36.5 27.25V36" stroke="#07A00D" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<filter id="filter0_d_14_18" x="-230" y="-118" width="342" height="248" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
<rect width="375" height="870" fill="white" transform="translate(-246 -373)"/>
</clipPath>
</defs>
</svg>

  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}