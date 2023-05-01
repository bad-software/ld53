// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { TextGenerationsService, getOptions } from './text-generations.class.js'

export const textGenerationsPath = 'text-generations'
export const textGenerationsMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './text-generations.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const textGenerations = (app) => {
  // Register our service on the Feathers application
  app.use(textGenerationsPath, new TextGenerationsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: textGenerationsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(textGenerationsPath).hooks({
    around: {
      all: [authenticate('jwt')]
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
