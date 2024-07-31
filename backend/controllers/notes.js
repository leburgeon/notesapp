const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

notesRouter.get('/', async (request, response) => { 
  const notes = await Note
    .find({}).populate('user', {username: 1, name: 1})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// This method takes an express request, sent to server by the browser, strips the auth scheme and returns the token
const getTokenFrom = req => {
  // Express request object get method returns the specified header field
  const authorisation = req.get('authorization')
  if (authorisation && authorisation.startsWith('Bearer ')){
    return authorisation.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  // jwt.verify method takes the auth token and verifies the signature part of it using the secret stored in the environment variable SECRET. If it verifies, it returns the decoded token
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  // If the token was not varified using the secret, returning null, or the token does not contain an id field, the token is invalid
  // Validation of signature is done by reconcatinating the header and payload, and rehashing using the secret. if the signature is the same, the token is valid (was produced by the server)
  if (!decodedToken.id) {
    return response.status(401).json({error: 'invalid token'})
  }

  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id,
  })
  
  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  // Save method used on the user document persists any changes to that document to the database
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response, next) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter