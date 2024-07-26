export class PlaylistsHandler {
  #playlistsService
  #songsService
  #validator

  /**
   * @typedef {import('../../services/postgres/PlaylistsService').PlaylistsService} PlaylistsService
   * @typedef {import('../../services/postgres/SongsService').SongsService} SongsService
   * @typedef {import('../../validators/playlists/index').PlaylistsValidator} PlaylistsValidator
   *
   * @param {PlaylistsService} playlistsService
   * @param {SongsService} songsService
   * @param {PlaylistsValidator} validator
  */
  constructor (playlistsService, songsService, validator) {
    this.#playlistsService = playlistsService
    this.#songsService = songsService
    this.#validator = validator
  }

  async postPlaylistHandler (request, h) {
    this.#validator.validatePlaylistPayload(request.payload)

    const { name } = request.payload
    const { id: credentialId } = request.auth.credentials
    const playlistId = await this.#playlistsService.addPlaylist(credentialId, name)

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId
      }
    }).code(201)

    return response
  }

  async getPlaylistsHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this.#playlistsService.getPlaylists(credentialId)

    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  async deletePlaylistByIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this.#playlistsService.verifyPlaylistsOwner(id, credentialId)
    await this.#playlistsService.deletePlaylist(id)

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    }
  }

  async postPlaylistSongHandler (request, h) {
    const { id: playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this.#playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    this.#validator.validatePlaylistSongPayload(request.payload)

    const { songId } = request.payload
    await this.#songsService.verifySong(songId)
    await this.#playlistsService.addSongToPlaylist(playlistId, songId)
    await this.#playlistsService.addPlaylistActivities(playlistId, credentialId, songId, 'add')

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu ke dalam playlist'
    }).code(201)

    return response
  }

  async getPlaylistSongsByPlaylistIdHandler (request, h) {
    const { id: playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this.#playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    const playlist = await this.#playlistsService.getPlaylistSongsByPlaylistId(playlistId)

    return {
      status: 'success',
      data: {
        playlist
      }
    }
  }

  async deletePlaylistSongByIdHandler (request, h) {
    const { id: playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this.#playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    this.#validator.validatePlaylistSongPayload(request.payload)

    const { songId } = request.payload
    await this.#playlistsService.deletePlaylistSongById(songId)
    await this.#playlistsService.addPlaylistActivities(playlistId, credentialId, songId, 'delete')

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist'
    }
  }

  async getPlaylistActivitesByPlaylistIdHandler (request, h) {
    const { id: playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this.#playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    const activities = await this.#playlistsService.getPlaylistActivitiesByPlaylistId(playlistId)

    return {
      status: 'success',
      data: {
        playlistId,
        activities
      }
    }
  }
}
