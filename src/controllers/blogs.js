const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const bodyParser = require('body-parser')

blogsRouter.use(bodyParser.json())

const formatBlog = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(formatBlog))
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.title === undefined || body.author === undefined || body.url === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes
    })

    const savedBlog = await blog.save()
    response.json(formatBlog(savedBlog))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
      response.json(formatBlog(blog))
    } else {
      response.status(404).end()
    }

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformed id' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformed id' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body
    console.log(body)
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog )
    response.json(formatBlog(updatedBlog))
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformed id' })
  }
})

module.exports = blogsRouter