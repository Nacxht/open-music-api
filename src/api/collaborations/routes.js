/**
 * @typedef {import('./handlers').CollaborationsHandler} CollaborationsHandler
 *
 * @param {CollaborationsHandler} handler
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
