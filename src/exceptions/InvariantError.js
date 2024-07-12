import { ClientError } from './ClientError.js'

export class InvariantError extends ClientError {
  constructor (message) {
    super(message)
    this.name = 'InvariantError'
  }
}
