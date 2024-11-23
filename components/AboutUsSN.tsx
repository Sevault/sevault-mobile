import { SvgXml } from 'react-native-svg'

export default function AboutUsSN() {
  const logoSvgMarkup = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.3333 10.0001C18.3333 5.39771 14.6023 1.66675 9.99999 1.66675C5.39761 1.66675 1.66666 5.39771 1.66666 10.0001C1.66666 14.6024 5.39761 18.3334 9.99999 18.3334C14.6023 18.3334 18.3333 14.6024 18.3333 10.0001Z" stroke="black" stroke-width="1.25"/>
  <path d="M10.2018 14.1667V10.0001C10.2018 9.60725 10.2018 9.41083 10.0798 9.28875C9.95775 9.16675 9.76133 9.16675 9.3685 9.16675" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.99335 6.66675H10.0008" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
        `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}