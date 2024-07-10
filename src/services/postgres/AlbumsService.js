import { nanoid } from 'nanoid'
import { Pool } from 'pg'
import { InvariantError } from '../../exceptions/InvariantError.js'
import { NotFoundError } from '../../exceptions/NotFoundError.js'

export class AlbumsService {
  #pool
  constructor () {
    this.#pool = new Pool()
  }

  async addAlbum ({ name, year }) {
    const id = `albums-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name]
    }

    const result = await this.#pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan album')
    }

    return result.rows[0].id
  }

  async getAlbumById (id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id]
    }

    const result = await this.#pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Album tidak ditemukan')
    }

    return result.rows
  }

  async editAlbumById (id, { name, year }) {
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id]
    }

    const result = await this.#pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
    }
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this.#pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan')
    }
  }
}
