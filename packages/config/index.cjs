const { config } = require('./config/index.js')

module.exports = {
  serverConfig: config.get( 'server' ),
  appConfig: config.get( 'app' ),
}
