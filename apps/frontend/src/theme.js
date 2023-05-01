import { local } from '@soulofmischief/proxy.js'


// Set default theme.
if ( !local.theme ) local.theme = 'auto'


export function setTheme( theme = null ) {
  let t =
    theme
      ? theme
      : local.theme
        ? local.theme
        : 'auto'

  // Query media for automatic theme detection.
  if ( t === 'auto' ) {
    if ( matchMedia( '(prefers-color-scheme: dark)' ).matches )
      t = 'dark'
    else
      t = 'light'
  }

  document.documentElement.setAttribute( 'data-theme', t )
}


// Load theme.
addEventListener( 'load', () => setTheme())


// Sync preference changes.
window
  .matchMedia( '(prefers-color-scheme: dark)' )
  .addEventListener( 'change', () => setTheme())

window
  .matchMedia( '(prefers-color-scheme: light)' )
  .addEventListener( 'change', () => setTheme())
