/**
 * @typedef {import('./handlers').AlbumsHandler} AlbumsHandler
 * @typedef {import('@hapi/hapi').ServerRoute} Route
*/

/**
 * @type {(handler: AlbumsHandler) => Route[]}
*/
export const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbumHandler(request, h)
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request, h) => handler.getAlbumByIdHandler(request, h)
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request, h) => handler.putAlbumByIdHandler(request, h)
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request, h) => handler.deleteAlbumByIdHandler(request, h)
  }
]
