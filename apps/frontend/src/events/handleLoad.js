import m from 'mithril'
import { setViewHeight } from './setViewHeight'
import { router } from '../router'


export const handleLoad = () => {
  // Calculate height.
  setViewHeight()

  // Route app.
  router( document.querySelector( '#root' ))

  // Set initial route to default to reset game state.
  if ( m.route.get() !== '/' )
    m.route.set( '/' )
}
