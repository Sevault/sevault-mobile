import { SvgXml } from 'react-native-svg'

export default function BitgesellLogoBlack() {
  const logoSvgMarkup = `
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M27.2389 27.2289H2.76113V2.77108H9.09915V20.9175H27.2389V27.2289ZM18.2321 2.77108V11.8536H27.2389V18.1464H11.8633V2.77108H18.2321ZM20.9963 9.0825H27.1804V2.77108H20.9963V9.0825ZM29.9415 0H18.2321H9.09915H0V30H30V20.9175V0H29.9415Z" fill="#0F0E0E"/>
  </svg>  
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}