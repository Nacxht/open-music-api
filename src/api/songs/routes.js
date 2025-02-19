/**
 * @typedef {import('./handlers').SongsHandler} SongsHandler
 * @typedef {import('@hapi/hapi').ServerRoute} Route
*/

/**
 * @type {(handler: SongsHandler) => Route[]}
*/
export const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => handler.postSongHandler(request, h)
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (request, h) => handler.getAllSongsHandler(request, h)
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (request, h) => handler.getSongByIdHandler(request, h)
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (request, h) => handler.putSongByIdHandler(request, h)
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (request, h) => handler.deleteSongByIdHandler(request, h)
  }
]
