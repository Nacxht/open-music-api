/**
 * @typedef {import('./handlers').UsersHandler} UsersHandler
 *
 * @param {UsersHandler} handler
*/
export const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.postUserHandler(request, h)
  }
]
