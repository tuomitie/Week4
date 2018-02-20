const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, nonExistingId, blogsInDb, usersInDb  } = require('../utils/test_helper')

beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('when there are initially some notes saved', async () => {
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
})
/*

describe('when trying to add a blog', async () => {
  test('a valid blog can be added', async () => {
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
})
*/

describe('when there is initially one user at db', async () => {
  beforeAll(async () => {
    await User.remove({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map(u=>u.username)
    expect(usernames).toContain(newUser.username)
  })
})

test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
  const usersBeforeOperation = await usersInDb()

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body).toEqual({ error: 'username must be unique'})

  const usersAfterOperation = await usersInDb()
  expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
})


afterAll(() => {
  server.close()
})
