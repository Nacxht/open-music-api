import { ClientError } from './ClientError.js'

export class AuthenticationError extends ClientError {
  constructor (message) {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}
