import config from '@bad-software/ld53-config'


const
  _3DRegex = /\.(dds|gl(b|tf)|vrm)$/,
  AudioRegex = /\.(mp3|ogg|wav)$/


/** @type {import('vite').UserConfig} */
export default {
  assetsInclude: [ _3DRegex, AudioRegex ],

  build: {
    commonjsOptions: {
      include: [ /node_modules/, /@bad-software\/config/ ],
    },
  },

  optimizeDeps: {
    include: [ '@bad-software/ld53-config' ],
  },

  plugins: [],

  resolve: {
    alias: {
      Assets: '/src/assets',
      Client: '/src/client',
      Components: '/src/view/components',
      Config: '/src/config',
      Layouts: '/src/view/layouts',
      Lib: '/src/lib',
      Models: '/src/models',
      Pages: '/src/view/pages',
      Router: '/src/router',
      Styles: '/src/styles',
    },
    // preserveSymlinks: true,
  },

  server: {
    port: '3400',
    fs: { strict: true },

    proxy: {
      '/api/v1': {
        target: 'https://ld53-backend.cos.lol',
        changeOrigin: true,
        rewrite: path => path.replace( /^\/api\/v1/, '' ),
      },
    },
  },

  worker: { format: 'es' },
}
