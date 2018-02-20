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

module.exports = {
  totalLikes,
  favoriteBlog
}