/**
 * @typedef {import('./handlers').AuthenticationsHandler} AuthenticationsHandler
 * @typedef {import('@hapi/hapi').ServerRoute} Route
*/

/**
 * @type {(handler: AuthenticationsHandler) => Route[]}
*/
export const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => handler.postAuthenticationHandler(request, h)
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (request, h) => handler.putAuthenticationHandler(request, h)
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (request, h) => handler.deleteAuthenticationHandler(request, h)
  }
]
