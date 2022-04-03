const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


describe('bloglist', () => {
  test('returns blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)

  test('contains expected amount of initial blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)

  })

})

describe('a new blog post', () => {
  test('can succesfully be added', async () => {
    await api
      .post('/api/blogs')
      .send(helper.singleNewBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(helper.initialBlogs.length+1)

    const titles = blogsAfter.map(blog => blog.title)
    expect(titles).toContain(helper.singleNewBlog.title)
  })

  test('sets likes to 0 if not passed explicitly', async () => {
    expect(helper.singleNewBlog.likes).toBeUndefined()
    // make sure, that likes isn't set
    const newBlog = await api
      .post('/api/blogs')
      .send(helper.singleNewBlog)

    expect(newBlog.body.likes).toBe(0)
  })

  test('without title causes bad request (400)', async () => {
    const newBlogWithoutTitle = {
      'author': 'Robert W. Martin',
      'url': 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .expect(400)
  })

  test('without url causes bad request (400)', async () => {
    const newBlogWithoutUrl = {
      'title': 'hello hello',
      'author': 'Robert S. Martin',
    }

    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(400)
  })
})

describe('a single blog', () => {
  test('unique idenitifier property is named id', async () => {
    const blogs = await api.get('/api/blogs')

    expect(blogs.body[0].id).toBeDefined()
    expect(blogs.body[0]._id).toBeUndefined()
  })

  test('can be deleted successfully', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length-1)

  })

  test('likes can be updated succesfully', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = await api.get(`/api/blogs/${blogsAtStart[1].id}`)

    const increasedLikes = { 'likes': blogToUpdate.body.likes+1 }


    const updatedBlog = await api.put(`/api/blogs/${blogsAtStart[1].id}`).send(increasedLikes).expect(201)
    expect(updatedBlog.body.likes).toBe(increasedLikes.likes)
  })
})


afterAll(() => {
  mongoose.connection.close()
})