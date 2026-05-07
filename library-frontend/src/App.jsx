import { useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { ALL_AUTHORS, ALL_BOOKS, ME } from './queries'

import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import Recommendations from './components/Recommendations'



const App = () => {
  const [token, setToken] = useState(() =>
    localStorage.getItem('library-user-token'),
  )
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  const loggedIn = Boolean(token)
  const meResult = useQuery(ME, {
    skip: !loggedIn,
  })

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const onLogin = (token) => {
    setToken(token)
    setPage('authors')
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.resetStore()
    setPage('authors')
  }

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  const favoriteGenre = meResult.data?.me?.favoriteGenre

  return (
    <div>
      <Notify errorMessage={errorMessage} />

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {loggedIn ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors
        show={page === 'authors'}
        authors={authorsResult.data.allAuthors}
        loggedIn={loggedIn}
      />

      <Books show={page === 'books'} books={booksResult.data.allBooks} />

      <NewBook show={loggedIn && page === 'add'} />

      <Recommendations
        show={loggedIn && page === 'recommend'}
        books={booksResult.data.allBooks}
        favoriteGenre={favoriteGenre}
      />

      <LoginForm
        show={!loggedIn && page === 'login'}
        onLogin={onLogin}
        setError={notify}
      />
    </div>
  )
}

export default App
