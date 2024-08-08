import { useState } from "react"
import { useMutation } from "@apollo/client"
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, ME } from "../queries"
import { updateCache } from "../App"

const NewBook = ({ show }) => {
  const [error, setError] = useState(null)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [published, setPublished] = useState("")
  const [genres, setGenres] = useState("")
  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n")
      setError(messages)
    },
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook)
    },
  })

  const submit = async (event) => {
    event.preventDefault()
    const genreArray = genres.split(",").map((genre) => genre.trim())
    try {
      await addBook({
        variables: {
          title,
          author,
          published: parseInt(published),
          genres: genreArray,
        },
      })
      setTitle("")
      setAuthor("")
      setPublished("")
      setGenres("")
    } catch (error) {
      console.error("Error adding book:", error.message)
    }
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={submit}>
        <div>
          Title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          Genres
          <input
            value={genres}
            onChange={({ target }) => setGenres(target.value)}
          />
        </div>
        <button type="submit">Add Book</button>
      </form>
      {error && <p>Error adding book: {error.message}</p>}
    </div>
  )
}

export default NewBook
