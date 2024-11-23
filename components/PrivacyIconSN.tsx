import { SvgXml } from 'react-native-svg'

export default function PrivacyLogo() {
  const logoSvgMarkup = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.8422 14.7163L12.9167 18.3333L15 17.5L17.0833 18.3333L16.25 14.6656M17.5 12.5C17.5 13.8808 16.3807 15 15 15C13.6192 15 12.5 13.8808 12.5 12.5C12.5 11.1193 13.6192 10 15 10C16.3807 10 17.5 11.1193 17.5 12.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.6666 8.33317C16.6666 5.19047 16.6666 3.61913 15.6903 2.64281C14.714 1.6665 13.1426 1.6665 9.99994 1.6665H9.16669C6.02403 1.6665 4.45268 1.6665 3.47638 2.6428C2.50007 3.6191 2.50006 5.19044 2.50003 8.33311L2.5 11.6664C2.49998 14.8092 2.49996 16.3805 3.47627 17.3568C4.45258 18.3332 6.02394 18.3332 9.16669 18.3332H10.8333" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.25 5.8335H12.9167M6.25 10.0002H10" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}