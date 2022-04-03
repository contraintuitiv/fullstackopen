const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


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

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const blog = new Blog(request.body)
  if(!blog.title) response.status(400).end()
  if(!blog.url) response.status(400).end()
  console.log('REQ', request.user)
  const user = request.user
  blog.user = user._id

  const result = await blog.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const toDelete = await Blog.findById(request.params.id)

  if(!toDelete) return response.status(404).json({ error: 'entry does not exist' })

  if(toDelete.user.toString() === request.user._id.toString()){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }else{
    response.status(403).end()
  }


})

module.exports = blogsRouter