import { nanoid } from 'nanoid'
import { InvariantError } from '../../exceptions/InvariantError.js'
import { NotFoundError } from '../../exceptions/NotFoundError.js'
import { albumDetailMapper } from '../../utils/DBMapper.js'

import pg from 'pg'
const { Pool } = pg

export class AlbumsService {
  #pool
  constructor () {
    this.#pool = new Pool()
  }

  async addAlbum ({ name, year }) {
    const id = `album-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year]
    }

    const result = await this.#pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan album')
    }

    return result.rows[0].id
  }

  async getAlbumById (id) {
    const query = {
      text: 'SELECT albums.id AS album_id, albums.name AS album_name, albums.year AS album_year, songs.id AS song_id, songs.title AS song_title, songs.performer AS song_performer FROM albums LEFT JOIN songs ON albums.id = songs.album_id WHERE albums.id = $1',
      values: [id]
    }

    const result = await this.#pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    return albumDetailMapper(result.rows)
  }

  async editAlbumById (id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id]
    }

    const result = await this.#pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
    }
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this.#pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan')
    }
  }
}
