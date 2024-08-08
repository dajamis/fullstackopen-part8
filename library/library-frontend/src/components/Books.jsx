import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const { loading, error, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    fetchPolicy: "cache-and-network",
  })

  useEffect(() => {
    if (show) {
      refetch()
    }
  }, [show, refetch])

  if (!show) {
    return null
  }

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }

  const books = data.allBooks
  const genres = Array.from(new Set(books.flatMap((book) => book.genres)))

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre)
    refetch({ genre })
  }

  return (
    <div>
      <h2>Books</h2>
      {selectedGenre ? (
        <p>
          In genre <strong>{selectedGenre}</strong>
        </p>
      ) : null}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => handleGenreClick(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => handleGenreClick(null)}>All genres</button>
      </div>
    </div>
  )
}

export default Books
