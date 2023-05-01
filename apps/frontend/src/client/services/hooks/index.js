import { serverConfig } from '@bad-software/ld53-config'
//import channelHooks from './channels'
import userHooks from './users'


const { api } = serverConfig


export default app => {
  app.service( api.users ).hooks( userHooks )
}
