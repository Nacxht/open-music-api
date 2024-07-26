import { albumPayloadSchema } from './schema.js'
import { InvariantError } from '../../exceptions/InvariantError.js'

/**
 * @typedef {object} AlbumsValidator
 * @property {(payload: object) => void} validateAlbumPayload
*/

/**
 * @type {AlbumsValidator}
*/
export const albumsValidator = {
  validateAlbumPayload: (payload) => {
    const { error } = albumPayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  }
}
