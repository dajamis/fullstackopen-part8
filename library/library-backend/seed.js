const mongoose = require("mongoose")
const Author = require("./models/author")
const Book = require("./models/book")
const User = require("./models/user")
require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI

console.log("Connecting to", MONGODB_URI)

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB")
    return seedData()
  })
  .then(() => {
    console.log("Data successfully seeded")
    mongoose.connection.close()
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message)
  })

const seedData = async () => {
  await Author.deleteMany({})
  await Book.deleteMany({})
  await User.deleteMany({})

  const authors = [
    { name: "Robert Martin", born: 1952 },
    { name: "Martin Fowler", born: 1963 },
    { name: "Fyodor Dostoevsky", born: 1821 },
    { name: "Joshua Kerievsky" }, // birth year not known
    { name: "Sandi Metz" }, // birth year not known
  ]

  const savedAuthors = await Author.insertMany(authors)

  const books = [
    {
      title: "Clean Code",
      published: 2008,
      author: savedAuthors[0]._id,
      genres: ["refactoring"],
    },
    {
      title: "Agile software development",
      published: 2002,
      author: savedAuthors[0]._id,
      genres: ["agile", "patterns", "design"],
    },
    {
      title: "Refactoring, edition 2",
      published: 2018,
      author: savedAuthors[1]._id,
      genres: ["refactoring"],
    },
    {
      title: "Refactoring to patterns",
      published: 2008,
      author: savedAuthors[3]._id,
      genres: ["refactoring", "patterns"],
    },
    {
      title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
      published: 2012,
      author: savedAuthors[4]._id,
      genres: ["refactoring", "design"],
    },
    {
      title: "Crime and punishment",
      published: 1866,
      author: savedAuthors[2]._id,
      genres: ["classic", "crime"],
    },
    {
      title: "Demons",
      published: 1872,
      author: savedAuthors[2]._id,
      genres: ["classic", "revolution"],
    },
  ]

  await Book.insertMany(books)

  const users = [
    {
      username: "testuser1",
      favoriteGenre: "refactoring",
      password: "secret",
    },
    {
      username: "testuser2",
      favoriteGenre: "agile",
      password: "secret",
    },
  ]

  await User.insertMany(users)
}
