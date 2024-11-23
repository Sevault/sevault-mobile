import { SvgXml } from 'react-native-svg'

export default function VersionIcon() {
  const logoSvgMarkup = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.08337 10.0002C2.08337 6.26821 2.08337 4.40224 3.24274 3.24286C4.40212 2.0835 6.26809 2.0835 10 2.0835C13.732 2.0835 15.598 2.0835 16.7574 3.24286C17.9167 4.40224 17.9167 6.26821 17.9167 10.0002C17.9167 13.7321 17.9167 15.5981 16.7574 16.7575C15.598 17.9168 13.732 17.9168 10 17.9168C6.26809 17.9168 4.40212 17.9168 3.24274 16.7575C2.08337 15.5981 2.08337 13.7321 2.08337 10.0002Z" stroke="black"/>
<path d="M10.2019 14.1665V9.99984C10.2019 9.607 10.2019 9.41059 10.0798 9.2885C9.95778 9.1665 9.76136 9.1665 9.36853 9.1665" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.99329 6.6665H10.0008" stroke="black" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}