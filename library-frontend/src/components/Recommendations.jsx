const Recommendations = ({ show, books, favoriteGenre }) => {
  if (!show) {
    return null
  }

  if (!favoriteGenre) {
    return <div>loading...</div>
  }

  const recommendedBooks = books.filter((book) =>
    book.genres.includes(favoriteGenre),
  )

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((book) => (
            <tr key={book.id}>
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
