import { PlaylistPayloadSchema, playlistSongPayloadSchema } from './schema.js'
import { InvariantError } from '../../exceptions/InvariantError.js'

/**
 * @typedef {Object} PlaylistsValidator
 * @property {(payload: object) => void} validatePlaylistPayload
 * @property {(payload: object) => void} validatePlaylistSongPayload
*/

/**
 * @type {PlaylistsValidator}
*/
export const playlistsValidator = {
  validatePlaylistPayload: (payload) => {
    const { error } = PlaylistPayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  },

  validatePlaylistSongPayload: (payload) => {
    const { error } = playlistSongPayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  }
}
