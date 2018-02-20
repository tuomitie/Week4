const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Well hello, World',
    author: 'Stringer Curtis',
    url: 'http:www.google.com',
    likes: 0
  },
  {
    title: 'Rocking in the free world',
    author: 'Stringer Curtis',
    url: 'http:www.google.com/404',
    likes: 1
  },
  {
    title: 'Skate or die!!',
    author: 'Tony Montana',
    url: 'http:www.hakem.us',
    likes: 0
  },
  {
    title: 'Sleepy kitten',
    author: 'Martti Ahtisaari',
    url: 'http://www.lycos.com',
    likes: 643
  }
]

const nonExistingId = async () => {
  const blog = new Blog()
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(Blog.format)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}
