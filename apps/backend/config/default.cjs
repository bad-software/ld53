const port = 3401
const url = 'https://ld53-backend.cos.lol'

module.exports = {
  port,
  host: 'localhost',
  public: './public/',
  origins: [
    url,
    'https://ld53-seven.vercel.app',
  ],
  paginate: {
    default: 10,
    max: 50
  },
  sqlite: {
    client: 'sqlite3',
    connection: 'feathers.sqlite',
    useNullAsDefault: true
  },
  authentication: {
    entity: 'user',
    service: 'users',
    secret: process.env.FEATHERS_SECRET,
    authStrategies: [
      'jwt',
      'local',
      'gun',
      'test'
    ],
    jwtOptions: {
      header: {
        typ: 'access'
      },
      audience: 'https://yourdomain.com',
      algorithm: 'HS256',
      expiresIn: '1d'
    },
    local: {
      usernameField: 'username',
      passwordField: 'password'
    }
  }
}
