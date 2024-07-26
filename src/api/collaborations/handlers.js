export class CollaborationsHandler {
  #collaborationsService
  #playlistsService
  #usersService
  #validator

  /**
   * @typedef {import('../../services/postgres/CollaborationsService').CollaborationsService} CollaborationsService
   * @typedef {import('../../services/postgres/PlaylistsService').PlaylistsService} PlaylistsService
   * @typedef {import('../../services/postgres/UsersService').UsersService} UsersService
   * @typedef {import('../../validators/collaborations/index').CollaborationsValidator} CollaborationsValidator
   *
   * @param {CollaborationsService} collaborationsService
   * @param {PlaylistsService} playlistsService
   * @param {UsersService} usersService
   * @param {CollaborationsValidator} validator
  */
  constructor (collaborationsService, playlistsService, usersService, validator) {
    this.#collaborationsService = collaborationsService
    this.#playlistsService = playlistsService
    this.#usersService = usersService
    this.#validator = validator
  }

  async postCollaborationHandler (request, h) {
    this.#validator.validateCollaborationPayload(request.payload)

    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this.#playlistsService.verifyPlaylistsOwner(playlistId, credentialId)
    await this.#usersService.verifyUserId(userId)

    const collaborationId = await this.#collaborationsService.addCollaborator(
      playlistId, userId
    )

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId
      }
    }).code(201)

    return response
  }

  async deleteCollaborationHandler (request, h) {
    this.#validator.validateCollaborationPayload(request.payload)

    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this.#playlistsService.verifyPlaylistsOwner(playlistId, credentialId)
    await this.#collaborationsService.deleteCollaborator(playlistId, userId)

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus'
    }
  }
}
