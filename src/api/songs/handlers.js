export class SongsHandler {
  #service
  #validator
  constructor (service, validator) {
    this.#service = service
    this.#validator = validator
  }

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

  async putSongByIdHandler (request) {
    this.#validator.validateSongPayload(request.payload)
    const { id } = request.params

    await this.#service.editSongById(id, request.payload)

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui'
    }
  }

  async deleteSongByIdHandler (request) {
    const { id } = await request.params

    await this.#service.deleteSongById(id)

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    }
  }
}
