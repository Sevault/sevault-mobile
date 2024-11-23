import { SvgXml } from 'react-native-svg'

export default function ReceiveSN() {
  const logoSvgMarkup = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.6667 1.85158C11.1282 1.74238 10.5708 1.68506 10 1.68506C5.39765 1.68506 1.66669 5.41193 1.66669 10.0092C1.66669 14.6065 5.39765 18.3334 10 18.3334C14.6024 18.3334 18.3334 14.6065 18.3334 10.0092C18.3334 9.43917 18.2759 8.88233 18.1667 8.34442" stroke="black" stroke-width="1.25" stroke-linecap="round"/>
  <path d="M9.99998 7.51186C9.07948 7.51186 8.33331 8.07089 8.33331 8.76046C8.33331 9.45004 9.07948 10.0091 9.99998 10.0091C10.9205 10.0091 11.6666 10.5682 11.6666 11.2577C11.6666 11.9473 10.9205 12.5064 9.99998 12.5064M9.99998 7.51186C10.7256 7.51186 11.343 7.85932 11.5718 8.34429M9.99998 7.51186V6.67944M9.99998 12.5064C9.27431 12.5064 8.65698 12.159 8.42815 11.674M9.99998 12.5064V13.3388" stroke="black" stroke-width="1.25" stroke-linecap="round"/>
  <path d="M18.3293 1.66675L14.8494 5.14476M14.1626 2.10107L14.2611 4.67448C14.2611 5.28102 14.6237 5.65893 15.2841 5.7066L17.8875 5.82884" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
      `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}