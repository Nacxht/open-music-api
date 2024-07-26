import Jwt from '@hapi/jwt'
import { InvariantError } from '../exceptions/InvariantError.js'

/**
 * @typedef {Object} TokenManager
 * @property {(payload: object) => string} generateAccessToken
 * @property {(payload: object) => string} generateRefreshToken
 * @property {(refreshToken: string) => any} verifyRefreshToken
*/

/**
 * @type {TokenManager}
*/
export const tokenManager = {
  generateAccessToken: (payload) => {
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY)
  },

  generateRefreshToken: (payload) => {
    return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY)
  },

  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken)
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY)

      const { payload } = artifacts.decoded
      return payload
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid')
    }
  }
}
