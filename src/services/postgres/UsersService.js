import pg from 'pg'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { InvariantError } from '../../exceptions/InvariantError.js'
import { AuthenticationError } from '../../exceptions/AuthenticationError.js'
import { NotFoundError } from '../../exceptions/NotFoundError.js'

const { Pool } = pg

export class UsersService {
  #pool
  constructor () {
    this.#pool = new Pool()
  }

  async addUser ({ username, password, fullname }) {
    await this.verifyUsername(username)

    const id = `user-${nanoid(16)}`
    const hashedPassword = await bcrypt.hash(password, 10)

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('User gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async verifyUsername (username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this.#pool.query(query)

    if (result.rowCount) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan')
    }
  }

  async verifyUserId (userId) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan')
    }
  }

  async verifyUserCredentials (username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1 ',
      values: [username]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new AuthenticationError('Kredensial yang anda berikan salah')
    }

    const { id, password: hashedPassowrd } = result.rows[0]
    const isMatch = await bcrypt.compare(password, hashedPassowrd)

    if (!isMatch) {
      throw new AuthenticationError('Kredensial yang anda berikan salah')
    }

    return id
  }
}
