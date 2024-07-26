import Hapi from '@hapi/hapi'
import Jwt from '@hapi/jwt'
import { ClientError } from './exceptions/ClientError.js'
import { tokenManager } from './utils/TokenManager.js'

import { SongsService } from './services/postgres/SongsService.js'
import { songsPlugin } from './api/songs/index.js'
import { songsValidator } from './validators/songs/index.js'

import { AlbumsService } from './services/postgres/AlbumsService.js'
import { albumsPlugin } from './api/albums/index.js'
import { albumsValidator } from './validators/albums/index.js'

import { UsersService } from './services/postgres/UsersService.js'
import { usersPlugin } from './api/users/index.js'
import { usersValidator } from './validators/users/index.js'

import { AuthenticationsService } from './services/postgres/AuthenticationsService.js'
import { authenticationsPlugin } from './api/authentications/index.js'
import { authenticationsValidator } from './validators/authentications/index.js'

import { PlaylistsService } from './services/postgres/PlaylistsService.js'
import { playlistsPlugin } from './api/playlists/index.js'
import { playlistsValidator } from './validators/playlists/index.js'

import { CollaborationsService } from './services/postgres/CollaborationsService.js'
import { collaborationsPlugin } from './api/collaborations/index.js'
import { collaborationsValidator } from './validators/collaborations/index.js'

import dotenv from 'dotenv'
dotenv.config()

async function main () {
  // Service instance
  const albumsService = new AlbumsService()
  const songsService = new SongsService()
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const collaborationsService = new CollaborationsService()
  const playlistsService = new PlaylistsService(collaborationsService)

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

  // Register JWT
  await server.register([
    {
      plugin: Jwt
    }
  ])

  // Define JWT authentication strategy
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
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
    },
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: usersValidator
      }
    },
    {
      plugin: authenticationsPlugin,
      options: {
        authenticationsService,
        usersService,
        tokenManager,
        validator: authenticationsValidator
      }
    },
    {
      plugin: playlistsPlugin,
      options: {
        playlistsService,
        songsService,
        validator: playlistsValidator
      }
    },
    {
      plugin: collaborationsPlugin,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: collaborationsValidator
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

    if (response instanceof Error) {
      console.error(`${response.name} - ${response.message}`)
    }

    return h.continue
  })

  // Start server
  server
    .start()
    .then(() => console.log(`Server dijalankan pada ${server.info.uri}`))
}

main()
