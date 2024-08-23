const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')

const helper = require('./test_helper')

const Note = require('../models/note')
const { SECRET } = require('../utils/config')

describe('when there is one user in the database', () => {
  beforeEach(async () => {
    await helper.initialiseDatabase()
  })
  test('login with correct credentials returns valid token for correct user', async () =>{
    const initialUser = helper.initialUser

    const response = await api
      .post('/api/login')
      .send({
        username: initialUser.username,
        password: initialUser.password
      })
      .expect(200)

    const decodedToken = jwt.verify(response.body.token, SECRET)

    assert(decodedToken.username === initialUser.username)
  })

  test('creation of user succeeds with fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'someguy',
      name: 'actually a nice name',
      password: 'notarealASD"333sswrd'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation of a user fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'groot',
      name: 'Superuser',
      password: 'salaAFSD£"£3inen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('adding an invalid username returns validation error and correct status code', async () => {
    const usersAtStart = helper.usersInDb()

    const usernameTooShort = {
      username: "foo",
      name: "bar",
      password: "4Str0ngP155w0rD!"
    }

    await api
      .post('/api/users')
      .send(usernameTooShort)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map(user => user.username)

    assert(!usernames.includes('foo'))
  })

  test('adding a user with weak password returns error and status 400'), async () => {
    const weakUser = {
      username:"strongandlongusername",
      name:"silly",
      password:"weak"
    }

    const response = await api
      .post('/api/users')
      .send(weakUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

  }

  describe('when there are some initial notes', () => {

    test('notes are returned as json', async () => {
      await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
  
    test('all notes are returned', async () => {
      const response = await api.get('/api/notes')
  
      assert.strictEqual(response.body.length, helper.initialNotes.length)
    })
  
    test('a specific note is within the returned notes', async () => {
      const response = await api.get('/api/notes')
  
      const contents = response.body.map(r => r.content)
      assert(contents.includes('Browser can execute only JavaScript'))
    })
  
    describe('viewing a specific note', () => {
      test('succeeds with a valid id', async () => {
        // Notes in the database as array of json
        const notesAtStart = await helper.notesInDb()
  
        const noteToView = notesAtStart[0]
  
        const resultNote = await api
          .get(`/api/notes/${noteToView.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
  
        assert.deepStrictEqual(resultNote.body, noteToView)
      })
  
      test('fails with statuscode 404 if note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()
  
        await api
          .get(`/api/notes/${validNonexistingId}`)
          .expect(404)
      })
  
      test('fails with statuscode 400 id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'
  
        await api
          .get(`/api/notes/${invalidId}`)
          .expect(400)
      })
    })
  
    describe('addition of a new note', () => {

      test('succeeds with valid data', async () => {
        const oneMinuteToken = await helper.oneMinuteToken()

        const newNote = {
          content: 'async/await simplifies making async calls',
          important: true,
        }
  
        await api
          .post('/api/notes')
          .set('Authorization', `Bearer ${oneMinuteToken}`)
          .send(newNote)
          .expect(201)
          .expect('Content-Type', /application\/json/)
  
        const notesAtEnd = await helper.notesInDb()
        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)
  
        const contents = notesAtEnd.map(n => n.content)
        assert(contents.includes('async/await simplifies making async calls'))
      })
  
      test('fails with status code 400 if content missing', async () => {
        const oneMinuteToken = await helper.oneMinuteToken()

        const newNote = {
          important: true
        }
  
        await api
          .post('/api/notes')
          .set('Authorization', `Bearer ${oneMinuteToken}`)
          .send(newNote)
          .expect(400)
  
        const notesAtEnd = await helper.notesInDb()
  
        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
      })
    })
  
    describe('deletion of a note', () => {
      test('succeeds with status code 204 if id is valid', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]
  
        await api
          .delete(`/api/notes/${noteToDelete.id}`)
          .expect(204)
  
        const notesAtEnd = await helper.notesInDb()
  
        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
  
        const contents = notesAtEnd.map(r => r.content)
        assert(!contents.includes(noteToDelete.content))
      })
    })

  })
})



after(async () => {
  await mongoose.connection.close()
})