const apiVersion = 'v1'

module.exports = {
  app: {
    apiRoute: `/api/${apiVersion}`,
  },

  server: {
    api: {
      // chat: 'chat',
      users: 'users',
    },

    version: apiVersion,
  },
}
