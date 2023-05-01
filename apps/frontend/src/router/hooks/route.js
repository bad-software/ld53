import { authenticate } from 'Client/lib'
import m from 'mithril'
import { Default } from 'Layouts/Default'
import { getPageComponent } from './getPageComponent'


/**
 * Route to and render a component module.
 *
 * @param {string|Array} page Module name or array of module names.
 * @param {object} opts Route handling options.
 * @param {object} opts.layout Layout component
 * @returns {object} - Mithril route object.
 */
export const route = (
  page,
  {
    layout = Default,
    redirect = false,
  } = {}
) => ({
  // Get appropriate module on match.
  onmatch: async () => {
    // If provided an array, use the first item if authentication is
    // successful. Otherwise, use the second item.
    if ( Array.isArray( page )) {
      if ( await authenticate())
        return getPageComponent( page[0])
      else if ( redirect )
        return m.route.set( page[1] || '/' )
      else {
        return getPageComponent( page[1])
      }

    }

    // Else authenticate and render page.
    // Failed authentication will throw an error and kick the user back to
    // the default route.
    await authenticate()
    return getPageComponent( page )
  },

  // Render using default layout.
  render: v => m( layout, v )
})


