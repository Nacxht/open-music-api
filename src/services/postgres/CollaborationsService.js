import pg from 'pg'
import { nanoid } from 'nanoid'
import { InvariantError } from '../../exceptions/InvariantError.js'

const { Pool } = pg

export class CollaborationsService {
  #pool

  constructor () {
    this.#pool = new Pool()
  }

  async addCollaborator (playlistId, userId) {
    const id = `collaboration-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async deleteCollaborator (playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal dihapus')
    }
  }

  async verifyCollaborator (playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverifikasi')
    }
  }
}
