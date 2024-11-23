import { SvgXml } from 'react-native-svg'

export default function LogoutSN() {
  const logoSvgMarkup = `
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11 13.1875C10.9387 14.7308 9.65258 16.0412 7.9297 15.999C7.52887 15.9892 7.03344 15.8495 6.0426 15.57C3.65801 14.8974 1.58796 13.767 1.0913 11.2346C1 10.7691 1 10.2453 1 9.19771L1 7.80229C1 6.75468 1 6.23087 1.0913 5.76538C1.58796 3.23304 3.65801 2.10263 6.0426 1.43002C7.03345 1.15054 7.52887 1.0108 7.9297 1.00099C9.65257 0.958841 10.9387 2.26923 11 3.81251" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M16 8.50008H6.83334M16 8.50008C16 7.91656 14.3381 6.82636 13.9167 6.41675M16 8.50008C16 9.0836 14.3381 10.1738 13.9167 10.5834" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  
  `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}