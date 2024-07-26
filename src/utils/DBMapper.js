/**
 * @param {{album_id, album_name, album_year, song_id, song_title, song_performer}[]} albumDetailRow
*/

/**
 * @typedef {object} AlbumDetailRow
 * @property {string} album_id
 * @property {string} album_name
 * @property {number} album_year
 * @property {string} song_id
 * @property {string} song_title
 * @property {string} song_performer
 *
 * @param {AlbumDetailRow} rows
*/
export function albumDetailMapper (rows) {
  const album = {
    id: rows[0].album_id,
    name: rows[0].album_name,
    year: rows[0].album_year,
    songs: []
  }

  if (rows[0].song_id) {
    album.songs = rows.map((row) => ({
      id: row.song_id,
      title: row.song_title,
      performer: row.song_performer
    }))
  }

  return album
}

/**
 * @typedef {object} PlaylistRow
 * @property {string} playlist_id
 * @property {string} playlist_name
 * @property {string} username
 *
 * @param {PlaylistRow} row
*/
export function getPlaylistsMapper (row) {
  const { playlist_id: id, playlist_name: name, username } = row

  return {
    id, name, username
  }
}

/**
 * @typedef {object} PlaylistSongRow
 * @property {string} id
 * @property {string} playlist_id
 * @property {string} playlist_name
 * @property {string} song_id
 * @property {string} song_title
 * @property {string} song_performer
 * @property {string} username
 *
 * @param {PlaylistSongRow[]} rows
*/
export function getPlaylistSongMapper (rows) {
  const {
    playlist_id: playlistId, playlist_name: name, username
  } = rows[0]

  const songs = rows.map((row) => {
    return {
      id: row.id,
      title: row.song_title,
      performer: row.song_performer
    }
  })

  const result = {
    id: playlistId,
    name,
    username,
    songs
  }

  return result
}

/**
 * @typedef {object} PlaylistActivitiesRow
 * @property {string} activity_action
 * @property {string} activity_time
 * @property {string} song_title
 * @property {string} username
 *
 * @param {PlaylistActivitiesRow} row
*/
export function getPlaylistActivitiesMapper (row) {
  const {
    activity_action: action,
    activity_time: time,
    song_title: title,
    username
  } = row

  const result = {
    username,
    title,
    action,
    time
  }

  return result
}
