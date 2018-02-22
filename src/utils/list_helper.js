const _ = require('underscore')

const totalLikes = (bloglist) => bloglist.reduce(function (sum, blog) {
  return sum + blog.likes
}, 0)

const favoriteBlog = (bloglist) => {
  favorite = bloglist[0]
  for (var blog in bloglist) {
    if (bloglist[blog].likes > favorite.likes)
      favorite = bloglist[blog]
  }
  return favorite
}

const mostBlogs = (bloglist) => {
  var blogs = bloglist.reduce((prev, blog) => {
    return prev.concat({author: blog.author, likes: blog.likes})
  }, [])

  var counts = []
  for(blog in blogs) {
    if (!_.find(counts, {author: blogs[blog].author})) {
      counts.push({ author: blogs[blog].author, blogs: 1})
    } else {
      const modify = _.find(counts, {author: blogs[blog].author})
      modify.blogs += 1
    }
  }
  return _.max(counts, function(blog){return blog.blogs})
}

const mostLikes = (bloglist) => {
  var blogs = bloglist.reduce((prev, blog) => {
    return prev.concat({author: blog.author, likes: blog.likes})
  }, [])

  var likedBlogs = []
  for(blog in blogs) {
    if (!_.find(likedBlogs, {author: blogs[blog].author})) {
      likedBlogs.push({ author: blogs[blog].author, likes: blogs[blog].likes})
    } else {
      const modify = _.find(likedBlogs, {author: blogs[blog].author})
      modify.likes += blogs[blog].likes
    }
  }
  return _.max(likedBlogs, function(blog){return blog.likes})
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}