import { InvariantError } from '../../exceptions/InvariantError.js'
import { collaborationPayloadSchema } from './schema.js'

/**
 * @typedef {Object} CollaborationsValidator
 * @property {(payload: object) => void} validateCollaborationPayload
*/

/**
 * @type {CollaborationsValidator}
*/
export const collaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const { error } = collaborationPayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  }
}
