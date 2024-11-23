import { SvgXml } from 'react-native-svg'

export default function SettingsSN() {
  const logoSvgMarkup = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.99999 18.3334C14.6024 18.3334 18.3333 14.6025 18.3333 10.0001C18.3333 5.39771 14.6024 1.66675 9.99999 1.66675C5.39762 1.66675 1.66666 5.39771 1.66666 10.0001C1.66666 14.6025 5.39762 18.3334 9.99999 18.3334Z" stroke="black" stroke-width="1.25"/>
  <path d="M8.33334 7.49992C8.33334 6.57944 9.07951 5.83325 10 5.83325C10.9205 5.83325 11.6667 6.57944 11.6667 7.49992C11.6667 7.83171 11.5698 8.14086 11.4026 8.40059C10.9045 9.17467 10 9.91275 10 10.8333V11.2499" stroke="black" stroke-width="1.25" stroke-linecap="round"/>
  <path d="M9.99335 14.1667H10.0008" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
      `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}