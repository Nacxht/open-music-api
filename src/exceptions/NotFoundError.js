import { ClientError } from './ClientError'

export class NotFoundError extends ClientError {
  constructor (message) {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}
