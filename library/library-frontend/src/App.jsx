import { useQuery, useApolloClient, useSubscription } from "@apollo/client"
import { useState, useEffect } from "react"
// Components
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Notify from "./components/Notify"
import LoginForm from "./components/LoginForm"
import Recommendations from "./components/Recommendations"
// Queries
import { BOOK_ADDED, ALL_BOOKS } from "./queries"

export const updateCache = (cache, query, addedBook) => {
  // Helper function to eliminate saving the same book twice
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState("authors") // Define the page state
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem("library-user-token")
    if (token) {
      setToken(token)
    }
  }, [])

  const result = useQuery(ALL_BOOKS)

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const toggleLogin = () => {
    setShowLogin(!showLogin)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && (
          <button onClick={() => setPage("recommend")}>recommend</button>
        )}
        {token ? (
          <button onClick={logout}>logout</button>
        ) : (
          <button onClick={toggleLogin}>login</button>
        )}
      </div>
      <Notify errorMessage={errorMessage} />
      {showLogin && !token && (
        <LoginForm
          setToken={setToken}
          setError={notify}
          setShowLogin={setShowLogin}
        />
      )}
      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      {token && <NewBook show={page === "add"} setError={notify} />}
      {token && <Recommendations show={page === "recommend"} />}
    </div>
  )
}

export default App
