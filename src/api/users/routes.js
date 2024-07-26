/**
 * @typedef {import('./handlers').UsersHandler} UsersHandler
 * @typedef {import('@hapi/hapi').ServerRoute} Route
*/

/**
 * @type {(handler: UsersHandler) => Route[]}
*/
export const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.postUserHandler(request, h)
  }
]
