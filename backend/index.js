// dotenv used in node.js applications to load environment variables from a .env file into process.env
require('dotenv').config()

// Different way of importing modules
const express = require("express")
// For importing cors for changing access-control-allow-origin
const cors = require("cors")
// Express application stored in app variable
const app = express()
// Uses the json middlewear function to parse the raw text of post requests,
// appends the parsed json data to the 'body' attr of the request object
app.use(express.json())
// For processing responses with a cross-origin-resource-sharing mechanism 
app.use(cors())
// Middlewear for sending static resources upon certain requests
// Static takes an optional path-argument
app.use(express.static('dist'))

const Note = require('./models/note')

// Route mapping for the root url
app.get('/', (_request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// Mongooose getall
app.get('/api/notes', (_request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// Mongoose find by id
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.delete('/api/notes/:id', (request, response) => {
  console.log("delete alled ")
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)
  response.status(204).end() 
})

// Mongoose save a new note
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save().then(savedNote => response.json(savedNote))

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on http://${PORT}`);
});