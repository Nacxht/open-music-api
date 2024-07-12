import { ClientError } from './ClientError.js'

export class NotFoundError extends ClientError {
  constructor (message) {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}
