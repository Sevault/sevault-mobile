import { SvgXml } from 'react-native-svg'

export default function AvatarIcon() {
  const logoSvgMarkup = `
  <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M29 53.1667C42.3469 53.1667 53.1667 42.3469 53.1667 29C53.1667 15.6532 42.3469 4.83337 29 4.83337C15.6531 4.83337 4.83334 15.6532 4.83334 29C4.83334 42.3469 15.6531 53.1667 29 53.1667Z" stroke="white" stroke-width="1.5"/>
  <path d="M18.125 41.0833C23.7599 35.1813 34.1794 34.9034 39.875 41.0833M35.0298 22.9583C35.0298 26.295 32.321 29 28.9795 29C25.6382 29 22.9293 26.295 22.9293 22.9583C22.9293 19.6216 25.6382 16.9166 28.9795 16.9166C32.321 16.9166 35.0298 19.6216 35.0298 22.9583Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}