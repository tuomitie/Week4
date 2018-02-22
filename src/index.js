const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const Blog = require('./models/blog')
const User = require('./models/user')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const config = require('./utils/config')
const underscore = require('underscore')

mongoose
  .connect(config.mongoUrl)
  .then( () => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch( err => {
    console.log(err)
  })

mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(middleware.logger)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.error)
app.use(underscore)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}