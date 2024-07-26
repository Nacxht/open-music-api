/**
 * @typedef {import('./handlers').CollaborationsHandler} CollaborationsHandler
 * @typedef {import('@hapi/hapi').ServerRoute} Route
*/

/**
 * @type {(handler: CollaborationsHandler) => Route[]}
*/
export const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.postCollaborationHandler(request, h),
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request, h) => handler.deleteCollaborationHandler(request, h),
    options: {
      auth: 'openmusic_jwt'
    }
  }
]
