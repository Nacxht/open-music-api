/**
 * @typedef {import('../../services/postgres/AuthenticationsService').AuthenticationsService} AuthenticationService
 * @typedef {import('../../validators/authentications/index').AuthenticationValidator} AuthenticationValidator
 * @typedef {import('../../services/postgres/UsersService').UsersService} UsersService
 * @typedef {import('../../utils/TokenManager').TokenManager} TokenManager
*/

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 *
 * @typedef {(request: Request, h: ResponseToolkit) => ResponseObject} MethodHandler
*/

export class AuthenticationsHandler {
  #authenticationService
  #usersService
  #tokenManager
  #validator

  /**
   * @param {AuthenticationService} authenticationService
   * @param {UsersService} usersService
   * @param {TokenManager} tokenManager
   * @param {AuthenticationValidator} validator
  */
  constructor (authenticationService, usersService, tokenManager, validator) {
    this.#authenticationService = authenticationService
    this.#usersService = usersService
    this.#tokenManager = tokenManager
    this.#validator = validator
  }

  /**
   * @type {MethodHandler}
  */
  async postAuthenticationHandler (request, h) {
    this.#validator.validatePostAuthenticationPayload(request.payload)

    const { username, password } = request.payload
    const id = await this.#usersService.verifyUserCredentials(
      username,
      password
    )

    const accessToken = this.#tokenManager.generateAccessToken({ id })
    const refreshToken = this.#tokenManager.generateRefreshToken({ id })

    await this.#authenticationService.addRefreshToken(refreshToken)

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken
      }
    }).code(201)

    return response
  }

  /**
   * @type {MethodHandler}
  */
  async putAuthenticationHandler (request, h) {
    this.#validator.validatePutAuthenticationPayload(request.payload)

    const { refreshToken } = request.payload
    await this.#authenticationService.verifyRefreshToken(refreshToken)

    const { id } = this.#tokenManager.verifyRefreshToken(refreshToken)
    const accessToken = this.#tokenManager.generateAccessToken({ id })

    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken
      }
    }
  }

  /**
   * @type {MethodHandler}
  */
  async deleteAuthenticationHandler (request, h) {
    this.#validator.validateDeleteAuthenticationPayload(request.payload)
    const { refreshToken } = request.payload

    await this.#authenticationService.verifyRefreshToken(refreshToken)
    await this.#authenticationService.deleteRefreshToken(refreshToken)

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus'
    }
  }
}
