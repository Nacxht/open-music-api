import { PlaylistsHandler } from './handlers.js'
import { routes } from './routes.js'

export const playlistsPlugin = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    playlistsService, songsService, validator
  }) => {
    const playlistsHandler = new PlaylistsHandler(playlistsService, songsService, validator)

    server.route(routes(playlistsHandler))
  }
}
