import { SongsHandler } from './handlers.js'
import { routes } from './routes.js'

export const songsPlugin = {
  name: 'songs',
  version: '1.0.0',

  register: async (server, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator)
    server.route(routes(songsHandler))
  }
}
