// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { alterItems, disallow } from 'feathers-hooks-common'

import { UserService, getOptions } from './users.class.js'
import {
  userDataResolver,
  userDataValidator,
  userExternalResolver,
  userPatchResolver,
  userPatchValidator,
  userQueryResolver,
  userQueryValidator,
  userResolver
} from './users.schema.js'

export const userPath = 'users'
export const userMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './users.class.js'
export * from './users.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const user = app => {
  // Register our service on the Feathers application
  app.use( userPath, new UserService( getOptions( app )), {
    // A list of all methods this service exposes externally
    methods: userMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service( userPath ).hooks({
    around: {
      all: [schemaHooks.resolveExternal( userExternalResolver ), schemaHooks.resolveResult( userResolver )],
      find: [authenticate( 'jwt' )],
      get: [authenticate( 'jwt' )],
      create: [],
      update: [
        authenticate( 'jwt' ),
        disallow( 'external' ),
      ],
      patch: [
        authenticate( 'jwt' ),
      ],
      remove: [
        authenticate( 'jwt' ),
        disallow( 'external' ),
      ]
    },
    before: {
      all: [schemaHooks.validateQuery( userQueryValidator ), schemaHooks.resolveQuery( userQueryResolver )],
      find: [],
      get: [],
      create: [
        alterItems( data => {
          data.highScore = 0
          data.createdAt = Date.now()
        }),
        schemaHooks.validateData( userDataValidator ),
        schemaHooks.resolveData( userDataResolver ),
      ],
      patch: [
        schemaHooks.validateData( userPatchValidator ),
        schemaHooks.resolveData( userPatchResolver )
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
