import auth from '@feathersjs/authentication-client'
import { feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
//import rx from 'feathers-reactive'
import io from 'socket.io-client'
import appHooks  from './app.hooks'
import hooks from './services/hooks'


/**
 * Configure and export Feathers client.
 */

export const
  currentAPI = 'api/v1',
  client = feathers()


;[
  socketio( io( 'https://ld53-backend.cos.lol' )),
  //socketio( io( config.server.socket )),
  //rx({ idField: config.server.idField }),
  auth({ storage: localStorage }),
  hooks,
].forEach( x => client.configure( x ))

// Configure services.

// These services rely on external API calls which have unpredictable latency.
// client.service( api.posts ).timeout = 6000000

// Configure hooks.
client.hooks( appHooks )
