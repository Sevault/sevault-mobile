import { SvgXml } from 'react-native-svg'

export default function HomeIcon() {
  const logoSvgMarkup = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.0001 15V12.5" stroke="black" stroke-width="1.25" stroke-linecap="round"/>
  <path d="M1.95957 11.0113C1.66539 9.09691 1.5183 8.13977 1.88022 7.29123C2.24214 6.44268 3.04511 5.86211 4.65103 4.70096L5.85091 3.83341C7.84866 2.38897 8.84757 1.66675 10.0001 1.66675C11.1526 1.66675 12.1515 2.38897 14.1492 3.83341L15.3491 4.70096C16.9551 5.86211 17.7581 6.44268 18.12 7.29123C18.4819 8.13977 18.3348 9.09691 18.0406 11.0113L17.7897 12.6437C17.3727 15.3575 17.1641 16.7144 16.1909 17.5239C15.2176 18.3334 13.7948 18.3334 10.9491 18.3334H9.05107C6.20537 18.3334 4.78251 18.3334 3.80925 17.5239C2.83599 16.7144 2.62747 15.3575 2.21044 12.6437L1.95957 11.0113Z" stroke="black" stroke-width="1.25" stroke-linejoin="round"/>
  </svg>
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}