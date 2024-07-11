import { AlbumsHandler } from './handlers.js'
import { routes } from './routes.js'

export const albumsPlugin = {
  name: 'albums',
  version: '1.0.0',

  register: async (server, { service, validator }) => {
    const albumsHandler = new AlbumsHandler(service, validator)
    server.route(routes(albumsHandler))
  }
}
