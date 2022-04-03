const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

test('userlogin works', async () => {
  await api
    .post('/api/login')
    .send({ 'username': 'valentin', 'password': 'dontTellAnyone' })
    .expect(200)
})


describe('create user', () => {
  test('works if all conditions are met', async () => {
    await api
      .post('/api/users')
      .send(helper.dummyUser)
      .expect(201)

    const usersAfterwards = await api.get('/api/users')

    expect(usersAfterwards.body).toHaveLength(helper.initialUsers.length+1)
  })

  test('fails if username is not set or has less than 3 characters', async () => {
    const dummyUser1 = {
      'username': 'bl',
      'name': 'Captain Blaubaer',
      'password': 'heinz'
    }

    await api
      .post('/api/users')
      .send(dummyUser1)
      .expect(400)

    const dummyUser2 = {
      'name': 'Captain Blaubaer',
      'password': 'heinz'
    }

    await api
      .post('/api/users')
      .send(dummyUser2)
      .expect(400)

    const usersAfterwards = await api.get('/api/users')

    expect(usersAfterwards.body).toHaveLength(helper.initialUsers.length)

  })
  test('fails if password is not set or has less than 3 characters', async () => {
    const dummyUser1 = {
      'username': 'blaubaer',
      'name': 'Captain Blaubaer',
      'password': 'he'
    }

    await api
      .post('/api/users')
      .send(dummyUser1)
      .expect(400)

    const dummyUser2 = {
      'name': 'Captain Blaubaer',
      'username': 'blababa'
    }

    await api
      .post('/api/users')
      .send(dummyUser2)
      .expect(400)

    const usersAfterwards = await api.get('/api/users')

    expect(usersAfterwards.body).toHaveLength(helper.initialUsers.length)

  })
})

afterAll(() => {
  mongoose.connection.close()
})