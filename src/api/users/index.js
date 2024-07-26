import { UsersHandler } from './handlers.js'
import { routes } from './routes.js'

export const usersPlugin = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const handler = new UsersHandler(service, validator)
    server.route(routes(handler))
  }
}
