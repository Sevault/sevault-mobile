import { SvgXml } from 'react-native-svg'

export default function BackupWalletSN() {
  const logoSvgMarkup = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6025 18.3334 10.0001C18.3334 5.39771 14.6025 1.66675 10.0001 1.66675C5.39771 1.66675 1.66675 5.39771 1.66675 10.0001C1.66675 14.6025 5.39771 18.3334 10.0001 18.3334Z" stroke="black" stroke-width="1.25"/>
  <path d="M10.0001 13.3334V6.66675M10.0001 13.3334C9.41658 13.3334 8.32636 11.6715 7.91675 11.2501M10.0001 13.3334C10.5836 13.3334 11.6738 11.6715 12.0834 11.2501" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
    `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}