import { SvgXml } from 'react-native-svg'

export default function SendLogoSN() {
  const logoSvgMarkup = `
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="20" fill="white"/>
  <path d="M25.5397 13.544C23.7247 11.5894 10.072 16.3776 10.0833 18.1257C10.0961 20.1082 15.4151 20.718 16.8893 21.1317C17.7759 21.3803 18.0133 21.6353 18.2177 22.565C19.1436 26.7753 19.6084 28.8695 20.6678 28.9162C22.3565 28.9909 27.3111 15.4516 25.5397 13.544Z" stroke="black" stroke-width="1.25"/>
  <path d="M17.5833 21.4167L20.5 18.5" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}