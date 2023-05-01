import config from '@bad-software/ld53-config'


const
  { serverConfig } = config,
  { api } = serverConfig

/**
 *
 * @param app
 */
export function chat( app ) {
  app.use( `/${api.chat}`,  )
}
