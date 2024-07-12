import Hapi from '@hapi/hapi'
import { albumsPlugin } from './api/albums/index.js'
import { songsPlugin } from './api/songs/index.js'
import { AlbumsService } from './services/postgres/AlbumsService.js'
import { SongsService } from './services/postgres/SongsService.js'
import { albumsValidator } from './validators/albums/index.js'
import { songsValidator } from './validators/songs/index.js'

import dotenv from 'dotenv'
import { ClientError } from './exceptions/ClientError.js'
dotenv.config()

async function main () {
  // Service instance
  const albumsService = new AlbumsService()
  const songsService = new SongsService()

  // Create server
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  // Register plugins
  await server.register([
    {
      plugin: albumsPlugin,
      options: {
        service: albumsService,
        validator: albumsValidator
      }
    },
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: songsValidator
      }
    }
  ])

  // PreResponse
  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message
      }).code(response.statusCode)

      return newResponse
    }

    return h.continue
  })

  // Start server
  server
    .start()
    .then(() => console.log(`Server dijalankan pada ${server.info.uri}`))
}

main()
