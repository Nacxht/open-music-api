import pg from 'pg'
import { nanoid } from 'nanoid'
import { InvariantError } from '../../exceptions/InvariantError.js'
import { NotFoundError } from '../../exceptions/NotFoundError.js'
import { AuthorizationError } from '../../exceptions/AuthorizationError.js'
import { getPlaylistActivitiesMapper, getPlaylistsMapper, getPlaylistSongMapper } from '../../utils/DBMapper.js'

/**
 * @typedef {import('./CollaborationsService.js').CollaborationsService} CollaborationsService
*/

const { Pool } = pg

export class PlaylistsService {
  #pool
  #collaborationsService

  /**
   * @param {CollaborationsService} collaborationsService
  */
  constructor (collaborationsService) {
    this.#pool = new Pool()
    this.#collaborationsService = collaborationsService
  }

  /**
   * @param {string} ownerId
   * @param {string} name
  */
  async addPlaylist (ownerId, name) {
    const id = `playlist-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, ownerId]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    return result.rows[0].id
  }

  /**
   * @param {string} ownerId
  */
  async getPlaylists (ownerId) {
    const query = {
      text: `SELECT playlists.id AS playlist_id,
      playlists.name AS playlist_name, users.username AS username
      FROM playlists
      LEFT JOIN users ON playlists.owner = users.id
      LEFT JOIN collaborations ON collaborations.user_id = $1
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [ownerId]
    }

    const result = await this.#pool.query(query)

    return result.rows.map(getPlaylistsMapper)
  }

  /**
   * @param {string} playlistId
  */
  async deletePlaylist (playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan')
    }
  }

  /**
   * @param {string} songId
   * @param {string} playlistId
  */
  async addSongToPlaylist (playlistId, songId) {
    const id = `playlist-songs-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan lagu ke dalam playlist.')
    }
  }

  /**
   * @param {string} playlistId
  */
  async getPlaylistSongsByPlaylistId (playlistId) {
    const query = {
      text: `SELECT
       playlist_songs.*,
       playlists.name AS playlist_name,
       users.username AS username,
       songs.title AS song_title,
       songs.performer AS song_performer
      FROM
       playlist_songs
      LEFT JOIN playlists ON playlists.id = playlist_songs.playlist_id
      LEFT JOIN users ON users.id = playlists.owner
      LEFT JOIN songs ON songs.id = playlist_songs.song_id
      WHERE
       playlist_songs.playlist_id = $1`,
      values: [playlistId]
    }

    const result = await this.#pool.query(query)

    return getPlaylistSongMapper(result.rows)
  }

  /**
   * @param {string} songId
  */
  async deletePlaylistSongById (songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING id',
      values: [songId]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus lagu dari playlist')
    }
  }

  /**
   * @param {string} playlistId
   * @param {string} userId
   * @param {string} songId
   * @param {string} action
  */
  async addPlaylistActivities (playlistId, userId, songId, action) {
    const id = `playlist-activities-${nanoid(16)}`
    const timestamptz = await this.#pool.query(
      `SELECT
       TO_CHAR(NOW() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
      AS
       iso8601_timestamp`
    )

    const query = {
      text: 'INSERT INTO playlist_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, userId, songId, action, timestamptz.rows[0].iso8601_timestamp]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan playlist activity')
    }
  }

  /**
   * @param {string} playlistId
  */
  async getPlaylistActivitiesByPlaylistId (playlistId) {
    const query = {
      text: `SELECT
       playlist_activities.action AS activity_action,
       playlist_activities.time AS activity_time,
       songs.title AS song_title,
       users.username AS username
      FROM
       playlist_activities
      LEFT JOIN songs ON songs.id = playlist_activities.song_id
      LEFT JOIN users ON users.id = playlist_activities.user_id
      WHERE
       playlist_activities.playlist_id = $1`,
      values: [playlistId]
    }

    const result = await this.#pool.query(query)

    return result.rows.length ? result.rows.map(getPlaylistActivitiesMapper) : []
  }

  /**
   * @param {string} playlistId
   * @param {string} ownerId
  */
  async verifyPlaylistsOwner (playlistId, ownerId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    const playlist = result.rows[0]

    if (playlist.owner !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }

  /**
   * @param {string} playlistId
   * @param {string} userId
  */
  async verifyPlaylistAccess (playlistId, userId) {
    try {
      await this.verifyPlaylistsOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }

      try {
        await this.#collaborationsService.verifyCollaborator(playlistId, userId)
      } catch (error) {
        if (error instanceof InvariantError) {
          throw new AuthorizationError(
            'Anda tidak berhak mengakses resource ini'
          )
        }
      }
    }
  }
}
