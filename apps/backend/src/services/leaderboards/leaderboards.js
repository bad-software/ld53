import { LeaderboardsService, getOptions } from './leaderboards.class.js'

export const leaderboardsPath = 'leaderboards'
export const leaderboardsMethods = [ 'get' ]

export * from './leaderboards.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const leaderboards = ( app ) => {
  // Register our service on the Feathers application
  app.use( leaderboardsPath, new LeaderboardsService( getOptions( app )), {
    // A list of all methods this service exposes externally
    methods: leaderboardsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service( leaderboardsPath ).hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
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
