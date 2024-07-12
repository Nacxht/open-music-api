import { albumPayloadSchema } from './schema.js'
import { InvariantError } from '../../exceptions/InvariantError.js'

export const albumsValidator = {
  validateAlbumPayload: (payload) => {
    const { error } = albumPayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  }
}
