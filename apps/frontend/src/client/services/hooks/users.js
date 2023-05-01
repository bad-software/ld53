//noinspection JSCheckFunctionSignatures

import m from 'mithril'
import { cache } from 'feathers-hooks-common'
// import { userCache } from '../cache'
// import { User } from 'Models/User'
//import { pull } from 'lodash-es'


export default {
  before: {
    all: [ /*cache( userCache )*/],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [ update()],
    remove: []
  },

  after: {
    all: [ /*cache( userCache )*/],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [ update()],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}


// Update user
// After hook seems to be quick enough.
function update() {
  return async context => {
    // Check if before or after hook.
    const { type } = context

    if ( type === 'before' ) {
      const { data } = context

      // Optimistic update.
      //console.log( 'BEFORE:', data )

      // Support pushes and pulls.
      /*if ( data.$pull ) {
        Object
          .entries( data.$pull )
          .forEach(([ key, value ]) => {
            pull( User.current()[ key ], value )
          })

        delete data.$pull
      }*/

      /*if ( data.$push ) {
        Object
          .entries( data.$push )
          .forEach(([ key, value ]) => {
            User.current()[ key ].push( value )
          })

        delete data.$push
      }*/

      // m.redraw()

    } else if ( type === 'after' ) {
      // await User.update( context.result )
      m.redraw()
    }

    return context
  }
}
