import { Pool } from "pg";

export class SongsService {
    #pool;
    constructor() {
        this.#pool = new Pool();
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {
        //
    }

    async getSongs() {
        //
    }

    async getSongById(id) {
        //
    }

    async editSongById(
        id,
        { title, year, genre, performer, duration, albumId }
    ) {
        //
    }

    async deleteSongBydId(id) {
        //
    }
}
