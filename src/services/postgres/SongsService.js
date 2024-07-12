import { nanoid } from 'nanoid'
import { InvariantError } from '../../exceptions/InvariantError.js'
import { NotFoundError } from '../../exceptions/NotFoundError.js'

import pg from 'pg'
const { Pool } = pg

export class SongsService {
  #pool
  constructor () {
    this.#pool = new Pool()
  }

  async addSong ({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId]
    }

    const result = await this.#pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu')
    }

    return result.rows[0].id
  }

  async getSongs (title, performer) {
    const query = title || performer
      ? {
          text: `SELECT id, title, performer FROM songs WHERE title ILIKE $1 ${title && performer ? 'AND' : 'OR'} performer ILIKE $2`,
          values: [`%${title}%`, `%${performer}%`]
        }
      : 'SELECT id, title, performer FROM songs'

    const result = await this.#pool.query(query).catch(error => console.log(error))

    return result.rows
  }

  async getSongById (id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id]
    }

    const result = await this.#pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }

    return result.rows[0]
  }

  async editSongById (id, { title, year, genre, performer, duration, albumId }) {
    const query = albumId
      ? {
          text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
          values: [title, year, genre, performer, duration, albumId, id]
        }
      : {
          text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5 WHERE id = $6 RETURNING id',
          values: [title, year, genre, performer, duration, id]
        }

    const result = await this.#pool.query(query).catch((error) => console.log(error))

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan')
    }
  }

  async deleteSongById (id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this.#pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan')
    }
  }
}
