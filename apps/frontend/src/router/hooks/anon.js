import { authenticate } from 'Client/lib'
import m from 'mithril'
import { Unauthenticated } from 'Layouts/Unauthenticated.js'
import { paths } from 'Router'
import { getPageComponent } from './getPageComponent.js'

/**
 * Only allow unauthenticated access to a route.
 * For some reason, hooking into route() here causes a render loop so we just
 * reimplement it.
 *
 * @param module
 * @param layout
 * @returns {{onmatch: (function(): Promise<void>), render: (function(*): *)}}
 */
export const anon = ( module, layout = Unauthenticated ) => {
  return {
    onmatch: async () =>
      ( await authenticate())
        ? m.route.set( paths.home )
        : // Don't throw an error here, it causes a render loop.
          getPageComponent( module ).catch( console.error ),

    // Render using default layout.
    render: ( v ) => m( layout, v ),
  }
}
