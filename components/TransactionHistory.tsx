import { View, Text } from 'react-native'
import { SvgXml } from 'react-native-svg'

export default function TransactionHistoryIcon() {
  const logoSvgMarkup = `
  <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="65" height="65" fill="#F5F5F5"/>
  <g clip-path="url(#clip0_14_18)">
  <rect width="375" height="870" transform="translate(-47 -370)" fill="white"/>
  <g filter="url(#filter0_d_14_18)">
  <rect x="-27" y="-115" width="334" height="240" rx="24" fill="white"/>
  </g>
  <rect x="-2" y="-86" width="299" height="196" fill="white"/>
  <circle cx="32.5" cy="32.5" r="32.5" fill="#0A6CFF" fill-opacity="0.19"/>
  <path d="M39.1875 29.125C42.1215 29.125 44.5 26.7465 44.5 23.8125C44.5 20.8785 42.1215 18.5 39.1875 18.5C36.2535 18.5 33.875 20.8785 33.875 23.8125C33.875 26.7465 36.2535 29.125 39.1875 29.125Z" stroke="#0AB5FF"/>
  <path d="M24.8125 29.125C27.7465 29.125 30.125 26.7465 30.125 23.8125C30.125 20.8785 27.7465 18.5 24.8125 18.5C21.8785 18.5 19.5 20.8785 19.5 23.8125C19.5 26.7465 21.8785 29.125 24.8125 29.125Z" stroke="#0AB5FF"/>
  <path d="M39.1875 43.5C42.1215 43.5 44.5 41.1215 44.5 38.1875C44.5 35.2535 42.1215 32.875 39.1875 32.875C36.2535 32.875 33.875 35.2535 33.875 38.1875C33.875 41.1215 36.2535 43.5 39.1875 43.5Z" stroke="#0AB5FF"/>
  <path d="M24.8125 43.5C27.7465 43.5 30.125 41.1215 30.125 38.1875C30.125 35.2535 27.7465 32.875 24.8125 32.875C21.8785 32.875 19.5 35.2535 19.5 38.1875C19.5 41.1215 21.8785 43.5 24.8125 43.5Z" stroke="#0AB5FF"/>
  </g>
  <defs>
  <filter id="filter0_d_14_18" x="-31" y="-115" width="342" height="248" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
  <rect width="375" height="870" fill="white" transform="translate(-47 -370)"/>
  </clipPath>
  </defs>
  </svg>
  
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}