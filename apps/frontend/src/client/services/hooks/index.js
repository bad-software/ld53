//import channelHooks from './channels'
import userHooks from './users'


export default app => {
  app.service( 'users' ).hooks( userHooks )
}
