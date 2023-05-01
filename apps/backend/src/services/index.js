import { voiceGenerations } from './voice-generations/voice-generations.js'

import { textGenerations } from './text-generations/text-generations.js'

import { leaderboards } from './leaderboards/leaderboards.js'

import { chat } from './chat/chat.js'
import { user } from './users/users.js'

export const services = (app) => {
  app.configure(voiceGenerations)

  app.configure(textGenerations)

  app.configure(leaderboards)

  app.configure(chat)
  app.configure(user)

  // All services will be registered here
}
