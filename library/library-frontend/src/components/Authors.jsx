import React from "react"
import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../queries"

const Authors = ({ show }) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS)

  console.log("Authors component rendered, show:", show)

  if (!show) {
    return null
  }

  if (loading) {
    console.log("Loading authors...")
    return <p>Loading...</p>
  }
  if (error) {
    console.log("Error loading authors:", error.message)
    return <p>Error: {error.message}</p>
  }

  console.log("Authors data:", data)

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
        </thead>
        <tbody>
          {data.allAuthors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
