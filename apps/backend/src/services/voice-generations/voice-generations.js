// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { VoiceGenerationsService, getOptions } from './voice-generations.class.js'

export const voiceGenerationsPath = 'voice-generations'
export const voiceGenerationsMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './voice-generations.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const voiceGenerations = (app) => {
  // Register our service on the Feathers application
  app.use(voiceGenerationsPath, new VoiceGenerationsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: voiceGenerationsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(voiceGenerationsPath).hooks({
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
