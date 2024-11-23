import { SvgXml } from 'react-native-svg'

export default function WBGLBrigdgeSN() {
  const logoSvgMarkup = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.5 5.83341C2.91667 5.83341 4.16667 5.41675 5 4.16675C5.83333 5.41675 7.5 7.50008 10 7.50008C12.5 7.50008 14.1667 5.41675 15 4.16675C15.8333 5.41675 17.0833 5.83341 17.5 5.83341" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5 3.33325V16.6666" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M1.66669 13.3333H18.3334" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M15 3.33325V16.6666" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8.33331 7.5V13.3333" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.6667 7.5V13.3333" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `
  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}