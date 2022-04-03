const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name : 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

// blogsRouter.put('/:id', async (request, response) => {
//   const newBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new:true })
//   response.json(newBlog)
// })



blogsRouter.put('/:id', async (request, response) => {

  const newBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  response.status(201).json(newBlog)
})


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
}

blogsRouter.post('/', async (request, response) => {

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog(request.body)
  if(!blog.title) response.status(400).end()
  if(!blog.url) response.status(400).end()
  const user = await User.findById(decodedToken.id)
  blog.user = user._id

  const result = await blog.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter