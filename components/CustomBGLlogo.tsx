import { SvgXml } from 'react-native-svg'

export default function CustomBGLlogo() {
  const logoSvgMarkup = `
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_172_90)">
  <mask id="mask0_172_90" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="217" height="46">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0V46H216.3V0H0Z" fill="white"/>
  </mask>
  <g mask="url(#mask0_172_90)">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M39.7 39.6H4V4H13.2V30.4H39.7V39.6ZM26.6 4V17.2H39.7V26.3H17.3V4H26.6ZM30.6 13.2H39.6V4H30.6V13.2ZM43.7 0H26.6H13.3H0V43.6H43.8V30.4L43.7 0Z" fill="#FFBA0A"/>
  </g>
  </g>
  <defs>
  <clipPath id="clip0_172_90">
  <rect width="43.8" height="43.6" fill="white"/>
  </clipPath>
  </defs>
  </svg>  
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}