import { InvariantError } from '../../exceptions/InvariantError.js'
import { userPayloadSchema } from './schema.js'

/**
 * @typedef {Object} UsersValidator
 * @property {(payload: object) => void} validateUserPayload
*/

/**
 * @type {UsersValidator}
*/
export const usersValidator = {
  validateUserPayload: (payload) => {
    const { error } = userPayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  }
}
