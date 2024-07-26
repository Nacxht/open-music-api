/**
  * @typedef {import('../../services/postgres/AlbumsService').AlbumsService} AlbumsService
  * @typedef {import('../../validators/albums/index').AlbumsValidator} AlbumsValidator
*/

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 *
 * @typedef {(request: Request, h: ResponseToolkit) => ResponseObject} MethodHandler
*/
export class AlbumsHandler {
  #service
  #validator

  /**
   * @param {AlbumsService} service
   * @param {AlbumsValidator} validator
  */
  constructor (service, validator) {
    this.#service = service
    this.#validator = validator
  }

  /**
   * @type {MethodHandler}
  */
  async postAlbumHandler (request, h) {
    this.#validator.validateAlbumPayload(request.payload)
    const albumId = await this.#service.addAlbum(request.payload)

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId
      }
    }).code(201)

    return response
  }

  /**
   * @type
  */
  async getAlbumByIdHandler (request) {
    const { id } = request.params
    const album = await this.#service.getAlbumById(id)

    return {
      status: 'success',
      data: {
        album
      }
    }
  }

  async putAlbumByIdHandler (request) {
    this.#validator.validateAlbumPayload(request.payload)
    const { id } = await request.params

    await this.#service.editAlbumById(id, request.payload)

    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    }
  }

  async deleteAlbumByIdHandler (request) {
    const { id } = await request.params

    await this.#service.deleteAlbumById(id)

    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }
}
