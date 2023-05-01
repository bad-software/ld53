import m from 'mithril'

import { anon as _, protect as X, route as O } from './hooks'
import { paths } from './paths.js'

/**
 * Map of paths to dynamically imported components in `src/view/pages`
 *
 * Route types:
 * X - authenticated
 * O - unauthenticated
 * _ - anonymous (unauthenticated-only)
 *
 */
export const routes = {
  [ paths.home ]: O( 'Intro' ),

  [ paths.help ]: O( 'Help' ),
  [ paths.leaderboard ]: O([ 'Leaderboard', 'Users/Login' ]),
  [ paths.play ]: O([ 'Play', 'Users/Login' ]),

  // Users
  [ paths.users.login ]: _([ 'Users/Login' ]),
  [ paths.users.signup ]: _([ 'Users/Signup' ]),

  // Redirect 404s to home.
  '/:404...': { onmatch: () => m.route.set( paths.home ) },
}
