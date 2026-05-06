const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const badUserInputError = (message, invalidArgs, error) => {
  throw new GraphQLError(message, {
    extensions: {
      code: 'BAD_USER_INPUT',
      invalidArgs,
      error,
    },
  })
}

const authenticationError = () => {
  throw new GraphQLError('not authenticated', {
    extensions: {
      code: 'BAD_USER_INPUT',
    },
  })
}

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = args.genre ? { genres: args.genre } : {}
      return Book.find(filter).populate('author')
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    bookCount: () => 0,
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        authenticationError()
      }

      const titleExists = await Book.exists({ title: args.title })

      if (titleExists) {
        badUserInputError(`Title must be unique: ${args.title}`, args.title)
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })

        try {
          await author.save()
        } catch (error) {
          badUserInputError(
            `Saving author failed: ${error.message}`,
            args.author,
            error,
          )
        }
      }

      const book = new Book({ ...args, author: author._id })

      try {
        await book.save()
      } catch (error) {
        badUserInputError(
          `Saving book failed: ${error.message}`,
          args.title,
          error,
        )
      }

      return book.populate('author')
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        authenticationError()
      }

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        return await author.save()
      } catch (error) {
        badUserInputError(
          `Saving author failed: ${error.message}`,
          args.name,
          error,
        )
      }
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      try {
        return await user.save()
      } catch (error) {
        badUserInputError(
          `Creating user failed: ${error.message}`,
          args.username,
          error,
        )
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }

      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})

      return true
    },
  },
}

module.exports = resolvers
