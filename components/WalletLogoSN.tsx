import { SvgXml } from 'react-native-svg'

export default function WalletLogoSN() {
  const logoSvgMarkup = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.3333 11.6667C13.3333 12.3571 13.893 12.9167 14.5833 12.9167C15.2736 12.9167 15.8333 12.3571 15.8333 11.6667C15.8333 10.9764 15.2736 10.4167 14.5833 10.4167C13.893 10.4167 13.3333 10.9764 13.3333 11.6667Z" stroke="black" stroke-width="1.25"/>
  <path d="M15.75 6.66675C15.8047 6.39749 15.8333 6.11881 15.8333 5.83341C15.8333 3.53223 13.9678 1.66675 11.6667 1.66675C9.3655 1.66675 7.5 3.53223 7.5 5.83341C7.5 6.11881 7.52869 6.39749 7.58335 6.66675" stroke="black" stroke-width="1.25"/>
  <path d="M5.83335 6.66095H13.3334C15.6904 6.66095 16.8689 6.66095 17.6011 7.39354C18.3334 8.12613 18.3334 9.30517 18.3334 11.6633V13.3308C18.3334 15.689 18.3334 16.8681 17.6011 17.6007C16.8689 18.3333 15.6904 18.3333 13.3334 18.3333H8.33335C5.19065 18.3333 3.61931 18.3333 2.643 17.3565C1.66669 16.3797 1.66669 14.8076 1.66669 11.6633V9.99592C1.66669 6.85168 1.66669 5.27957 2.643 4.30279C3.4289 3.5165 4.60038 3.36316 6.66669 3.33325H8.33335" stroke="black" stroke-width="1.25" stroke-linecap="round"/>
  </svg>
    `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}