import pg from 'pg'
import { InvariantError } from '../../exceptions/InvariantError.js'

const { Pool } = pg

export class AuthenticationsService {
  #pool
  constructor () {
    this.#pool = new Pool()
  }

  /**
   * @param {string} token
  */
  async addRefreshToken (token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token]
    }

    await this.#pool.query(query)
  }

  /**
   * @param {string} token
  */
  async verifyRefreshToken (token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token]
    }

    const result = await this.#pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Refresh Token tidak valid')
    }
  }

  /**
   * @param {string} token
  */
  async deleteRefreshToken (token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token]
    }

    await this.#pool.query(query)
  }
}
