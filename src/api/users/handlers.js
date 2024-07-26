/**
 * @typedef {import('../../services/postgres/UsersService').UsersService} UsersService
 * @typedef {import('../../validators/users/index').UsersValidator} UsersValidator
*/

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 *
 * @typedef {(request: Request, h: ResponseToolkit) => ResponseObject} MethodHandler
*/

export class UsersHandler {
  #service
  #validator

  /**
   * @param {UsersService} service
   * @param {UsersValidator} validator
  */
  constructor (service, validator) {
    this.#service = service
    this.#validator = validator
  }

  /**
   * @type {MethodHandler}
  */
  async postUserHandler (request, h) {
    this.#validator.validateUserPayload(request.payload)
    const { username, password, fullname } = request.payload

    const userId = await this.#service.addUser({
      username, password, fullname
    })

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId
      }
    }).code(201)

    return response
  }
}
