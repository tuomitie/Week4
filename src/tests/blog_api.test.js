const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, nonExistingId, blogsInDb } = require('../utils/test_helper')

beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('notes are returned as json', async () => {
  const blogsInDatabase = await blogsInDb()
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.length).toBe(blogsInDatabase.length)

  const returnedContents = response.body.map(n => n.title)
  blogsInDatabase.forEach(blog => {
    expect(returnedContents).toContain(blog.title)
  })
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api
    .get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(contents).toContain('Sleepy kitten')
})

test('a valid blog can be added ', async () => {
  const blogsAtStart = await blogsInDb()

  const newBlog = {
    title: 'Stop the press!',
    author: 'Stöö',
    url: 'http://www.hakem.io',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAfterOperation = await blogsInDb()

  expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
  expect(blogsAfterOperation).toContainEqual(newBlog)
})

test('a blog without a title is not added ', async () => {
  const blogsAtStart = await blogsInDb()

  const newBlog = {
    author: 'Stöö',
    url: 'http://www.hakem.io',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAfterOperation = await blogsInDb()
  expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
})

test('a blog without an author is not added ', async () => {
  const blogsAtStart = await blogsInDb()

  const newBlog = {
    title: 'Töös',
    url: 'http://www.hakem.io',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAfterOperation = await blogsInDb()
  expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
})

test('a blog without an url is not added ', async () => {
  const blogsAtStart = await blogsInDb()

  const newBlog = {
    title: 'Töös',
    author: 'Stöö',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAfterOperation = await blogsInDb()
  expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
})


test('a blog without likes gets zero likes', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Stöö',
    url: 'http://www.hakem.io'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAfterOperation = await blogsInDb()

  expect(blogsAfterOperation[blogsAfterOperation.length-1].likes).toEqual(0)
  expect(blogsAfterOperation[blogsAfterOperation.length-1].title).toContain('Blog without likes')
})

afterAll(() => {
  server.close()
})
