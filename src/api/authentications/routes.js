/**
 * @typedef {import('./handlers').AuthenticationsHandler} AuthenticationsHandler
 *
 * @param {AuthenticationsHandler} handler
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
