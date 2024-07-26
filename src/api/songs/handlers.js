/**
 * @typedef {import('../../services/postgres/SongsService').SongsService} SongsService
 * @typedef {import('../../validators/songs/index').SongsValidator} SongsValidator
*/

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 *
 * @typedef {(request: Request, h: ResponseToolkit) => ResponseObject} MethodHandler
*/

export class SongsHandler {
  #service
  #validator

  /**
   * @param {SongsService} service
   * @param {SongsValidator} validator
  */
  constructor (service, validator) {
    this.#service = service
    this.#validator = validator
  }

  /**
   * @type {MethodHandler}
  */
  async postSongHandler (request, h) {
    this.#validator.validateSongPayload(request.payload)
    const songId = await this.#service.addSong(request.payload)

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu',
      data: {
        songId
      }
    }).code(201)

    return response
  }

  /**
   * @type {MethodHandler}
  */
  async getAllSongsHandler (request) {
    const { title, performer } = request.query
    const songs = await this.#service.getSongs(title, performer)

    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  /**
   * @type {MethodHandler}
  */
  async getSongByIdHandler (request) {
    const { id } = request.params
    const song = await this.#service.getSongById(id)

    return {
      status: 'success',
      data: {
        song
      }
    }
  }

  /**
   * @type {MethodHandler}
  */
  async putSongByIdHandler (request) {
    this.#validator.validateSongPayload(request.payload)
    const { id } = request.params

    await this.#service.editSongById(id, request.payload)

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui'
    }
  }

  /**
   * @type {MethodHandler}
  */
  async deleteSongByIdHandler (request) {
    const { id } = await request.params

    await this.#service.deleteSongById(id)

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    }
  }
}
