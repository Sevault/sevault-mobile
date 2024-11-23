import { SvgXml } from 'react-native-svg'

export default function BugIconSN() {
  const logoSvgMarkup = `
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.51089 4.15894C2.41101 5.04227 2.96039 7.01894 5.40767 7.01894" stroke="black" stroke-linecap="round"/>
<path d="M14.6626 6.98395C15.6964 7.14895 17.5943 6.24895 17.4964 4.16895" stroke="black" stroke-linecap="round"/>
<path d="M17.494 17.499C17.544 16.619 16.8147 14.629 14.6658 14.519" stroke="black" stroke-linecap="round"/>
<path d="M5.37634 14.5589C4.70842 14.3589 2.51086 15.2789 2.51086 17.4989" stroke="black" stroke-linecap="round"/>
<path d="M7.77494 5.09902C7.79492 4.24902 8.20446 2.49902 10.0024 2.49902C11.6007 2.49902 12.1551 3.84902 12.23 5.09902M5.21778 7.84902C5.31767 7.19902 6.07682 5.67902 7.80491 5.52902C9.55294 5.46302 11.9503 5.48902 12.3998 5.55902C12.9891 5.61146 14.4126 6.19902 14.7922 7.84902C14.927 8.69899 14.8571 9.89899 14.877 10.599C14.8471 11.299 14.9339 12.7186 14.7971 13.449C14.6973 14.249 14.1579 15.389 13.4187 16.089C12.3199 17.269 9.30327 18.509 6.69614 16.209C5.34763 14.909 5.25773 13.649 5.15785 13.149C5.13106 12.8809 5.13231 11.5636 5.13786 10.299C5.11789 9.20499 5.14365 8.15052 5.21778 7.84902Z" stroke="black"/>
<path d="M2.51086 10.749H4.95815" stroke="black" stroke-linecap="round"/>
<path d="M17.4941 10.749H15.0967" stroke="black" stroke-linecap="round"/>
<path d="M10.0027 13.749V16.899" stroke="black" stroke-linecap="round"/>
</svg>
        `

  const SVGLogo = () => <SvgXml xml={logoSvgMarkup} />
  return (
    <SVGLogo />
  )
}