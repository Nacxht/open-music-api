/**
 * @param {{album_id, album_name, album_year, song_id, song_title, song_performer}[]} albumDetailRow
*/
export function albumDetailMapper (albumDetailRow) {
  const album = {
    id: albumDetailRow[0].album_id,
    name: albumDetailRow[0].album_name,
    year: albumDetailRow[0].album_year,
    songs: []
  }

  if (albumDetailRow[0].song_id) {
    album.songs = albumDetailRow.map((row) => ({
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
 * @param {PlaylistRow} playlistRow
*/
export function getPlaylistsMapper (playlistRow) {
  const { playlist_id: id, playlist_name: name, username } = playlistRow

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
 * @param {PlaylistSongRow[]} playlistSongRows
*/
export function getPlaylistSongMapper (playlistSongRows) {
  const {
    playlist_id: playlistId, playlist_name: name, username
  } = playlistSongRows[0]

  const songs = playlistSongRows.map((row) => {
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
 * @param {PlaylistActivitiesRow} playlistActivitiesRow
*/
export function getPlaylistActivitiesMapper (playlistActivitiesRow) {
  const {
    activity_action: action,
    activity_time: time,
    song_title: title,
    username
  } = playlistActivitiesRow

  const result = {
    username,
    title,
    action,
    time
  }

  return result
}
