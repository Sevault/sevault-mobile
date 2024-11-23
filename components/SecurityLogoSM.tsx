
import { SvgXml } from 'react-native-svg'

export default function SecurityLogo() {
  const logoSvgMarkup = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 9.31981V6.90057C17.5 5.5339 17.5 4.85057 17.1632 4.40473C16.8265 3.95891 16.0651 3.74246 14.5423 3.30958C13.5018 3.01383 12.5847 2.65752 11.8519 2.33223C10.8528 1.88874 10.3533 1.66699 10 1.66699C9.64667 1.66699 9.14717 1.88874 8.14809 2.33223C7.41532 2.65752 6.4982 3.01383 5.45778 3.30958C3.93494 3.74246 3.17352 3.95891 2.83676 4.40473C2.5 4.85057 2.5 5.5339 2.5 6.90057V9.31981C2.5 14.0074 6.71897 16.8199 8.82833 17.9331C9.33425 18.2001 9.58717 18.3336 10 18.3336C10.4128 18.3336 10.6657 18.2001 11.1717 17.9331C13.281 16.8199 17.5 14.0074 17.5 9.31981Z" stroke="black" stroke-linecap="round"/>
<path d="M10 5.8335V7.50016" stroke="black" stroke-linecap="round"/>
</svg>
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}