import { SvgXml } from 'react-native-svg'

export default function TxHistorySN() {
  const logoSvgMarkup = `
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="20" fill="white"/>
  <path d="M19.1721 27.4999H18.0046C15.0169 27.4999 13.523 27.4999 12.5948 26.5541C11.6667 25.6083 11.6667 24.0861 11.6667 21.0416C11.6667 17.9971 11.6667 16.4749 12.5948 15.5291C13.523 14.5833 15.0169 14.5833 18.0046 14.5833H21.1735C24.1612 14.5833 25.6551 14.5833 26.5833 15.5291C27.2974 16.2567 27.462 17.3257 27.5 19.1666" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M25.7083 25.7083L24.5833 24.9583V23.0833M20.8333 24.5833C20.8333 26.6543 22.5122 28.3333 24.5833 28.3333C26.6544 28.3333 28.3333 26.6543 28.3333 24.5833C28.3333 22.5122 26.6544 20.8333 24.5833 20.8333C22.5122 20.8333 20.8333 22.5122 20.8333 24.5833Z" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M23.3333 14.5834L23.2506 14.3259C22.838 13.0425 22.6317 12.4008 22.1407 12.0338C21.6496 11.6667 20.9975 11.6667 19.693 11.6667H19.4736C18.1692 11.6667 17.5169 11.6667 17.0259 12.0338C16.5349 12.4008 16.3286 13.0425 15.9161 14.3259L15.8333 14.5834" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}