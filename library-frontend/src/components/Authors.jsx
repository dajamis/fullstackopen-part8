import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!props.show) {
    return null
  }

  const selectedName = name || props.authors[0]?.name || ''

  const submit = (event) => {
    event.preventDefault()

    editAuthor({
      variables: {
        name: selectedName,
        setBornTo: Number(born),
      },
    })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {props.authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.loggedIn && (
        <>
          <h2>Set birthyear</h2>

          <form onSubmit={submit}>
            <div>
              <label htmlFor="author-name">name</label>
              <select
                id="author-name"
                name="name"
                value={selectedName}
                onChange={({ target }) => setName(target.value)}
              >
                {props.authors.map((author) => (
                  <option key={author.id} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="author-born">born</label>
              <input
                id="author-born"
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </>
      )}
    </div>
  )
}

export default Authors
