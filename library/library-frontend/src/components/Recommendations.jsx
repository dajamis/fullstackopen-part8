import React, { useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import { ME, ALL_BOOKS } from "../queries"

const Recommendations = ({ show }) => {
  const [error, setError] = useState(null) // Define the error state

  const {
    loading: meLoading,
    error: meError,
    data: meData,
  } = useQuery(ME, {
    onError: (error) => setError(error.message),
  })
  const {
    loading: booksLoading,
    error: booksError,
    data: booksData,
    refetch,
  } = useQuery(ALL_BOOKS, {
    skip: !meData?.me?.favoriteGenre,
    variables: { genre: meData?.me?.favoriteGenre },
    onError: (error) => setError(error.message),
  })

  useEffect(() => {
    if (show && meData?.me?.favoriteGenre) {
      refetch()
    }
  }, [show, meData, refetch])

  console.log("meData:", meData)
  console.log("booksData:", booksData)

  if (!show) {
    return null
  }

  if (meLoading || booksLoading) {
    return <p>Loading...</p>
  }

  if (meError || booksError) {
    return <p>Error: {error}</p>
  }

  if (!meData || !meData.me) {
    return <p>No user data available.</p>
  }

  const favoriteGenre = meData.me.favoriteGenre
  const books = booksData.allBooks.filter((book) =>
    book.genres.includes(favoriteGenre)
  )

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>
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
    </div>
  )
}

export default Recommendations
