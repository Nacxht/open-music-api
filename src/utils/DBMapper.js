/**
 * @param queryResultRows {[{album_id, album_name, album_year, song_id, song_title, song_performer}]}
*/
export function albumDetailMapper (queryResultRows) {
  const album = {
    id: queryResultRows[0].album_id,
    name: queryResultRows[0].album_name,
    year: queryResultRows[0].album_year,
    songs: []
  }

  if (queryResultRows[0].song_id) {
    album.songs = queryResultRows.map((row) => ({
      id: row.song_id,
      title: row.song_title,
      performer: row.song_performer
    }))
  }

  return album
}
