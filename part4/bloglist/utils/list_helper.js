const dummy = (blogs) => {
  return blogs?1:0
}

const totalLikes = (blogs) => {
  return blogs.reduce((prev, curr) => prev+curr.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, curr) => curr.likes>prev.likes?curr:prev)
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}