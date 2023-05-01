const { createURL } = require( '../lib/createURL.js' )


const
  serverHost = 'localhost',
  serverPort = 3402,
  serverProtocol = 'http',

  appHost = 'localhost',
  appPort = 3400,
  appProtocol = 'http'


module.exports = {
  app: {
    host: appHost,
    port: appPort,
    protocol: appProtocol,
    url: createURL( appProtocol, appHost, appPort ),
  },

  server: {
    host: serverHost,
    port: serverPort,
    protocol: serverProtocol,
    url: createURL( serverProtocol, serverHost, serverPort ),
  }
}
