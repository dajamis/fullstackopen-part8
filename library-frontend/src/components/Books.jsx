import { useState } from 'react'
import { useLazyQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [getBooks, booksResult] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: 'network-only',
  })

  if (!props.show) {
    return null
  }

  const genres = [...new Set(props.books.flatMap((book) => book.genres))]
  const booksToShow = selectedGenre
    ? booksResult.data?.allBooks || []
    : props.books

  const selectGenre = (genre) => {
    setSelectedGenre(genre)
    getBooks({ variables: { genre } })
  }

  const showAllGenres = () => {
    setSelectedGenre(null)
  }

  return (
    <div>
      <h2>books</h2>

      {selectedGenre && (
        <p>
          in genre <strong>{selectedGenre}</strong>
        </p>
      )}

      {selectedGenre && booksResult.loading ? (
        <p>loading...</p>
      ) : (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {booksToShow.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => selectGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={showAllGenres}>all genres</button>
      </div>
    </div>
  )
}

export default Books
