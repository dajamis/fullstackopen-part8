require('dotenv').config()

const mongoose = require('mongoose')
const startServer = require('./server')

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 4000

if (!MONGODB_URI) {
  console.log('MONGODB_URI is missing')
  process.exit(1)
}

console.log('connecting to MongoDB')

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
    startServer(PORT)
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })
