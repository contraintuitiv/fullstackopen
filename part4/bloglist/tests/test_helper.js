const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialBlogs = [
  {
    'title': 'Hamster-Blog',
    'author': 'Fredi Lorena',
    'url': 'http://hamsterblog.de',
    'likes': 0,
    'id': '62404ed769c7815f882ffd3d'
  },
  {
    'title': 'Platten-Blog',
    'author': 'Fredi Lorena',
    'url': 'http://plattenblog.de',
    'likes': 12,
    'id': '62404eea69c7815f882ffd3f'
  },
  {
    'title': 'wohnblog',
    'author': 'Lorena',
    'url': 'http://wohnblog.de',
    'likes': 0,
    'id': '62404f30ec1558eeba87b6b6'
  }
]

const singleNewBlog = {
  'title': 'Type wars',
  'author': 'Robert C. Martin',
  'url': 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
}


const blogsInDb = async () => {
  const blogs = await Blog.find({})

  return blogs.map(blog => blog.toJSON())
}

const initialUsers = [
  {
    'username': 'valentin',
    'name': 'Valentin Dietrich',
    'password': 'dontTellAnyone'
  },
  {
    'username': 'hellas',
    'name': 'Arto Hellas',
    'password': 'supersecure'
  }
]

const loginFirstUser = async () => {
  return await api
    .post('/api/login')
    .send(initialUsers[0])
}

const dummyUser =   {
  'username': 'blauba',
  'name': 'Captain Blaubaer',
  'password': 'heinz'
}

const usersInDb = async () => {
  const users = await User.find({})

  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, singleNewBlog,
  initialUsers, usersInDb, dummyUser, loginFirstUser
}