import { InvariantError } from '../../exceptions/InvariantError.js'
import {
  deleteAuthenticationPayloadSchema,
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema
} from './schema.js'

/**
 * @typedef {object} AuthenticationsValidator
 * @property {(payload: object) => void} validatePostAuthenticationPayload
 * @property {(payload: object) => void} validatePutAuthenticationPayload
 * @property {(payload: object) => void} validateDeleteAuthenticationPayload
*/

/**
 * @type {AuthenticationsValidator}
*/
export const authenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const { error } = postAuthenticationPayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const { error } = putAuthenticationPayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const { error } = deleteAuthenticationPayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  }
}
