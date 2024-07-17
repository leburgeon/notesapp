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

// Mongooose get all
app.get('/api/notes', (_request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// Mongoose find by id
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note){
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Mongoose find by id and delete
app.delete('/api/notes/:id', (request, response) => {
  console.log("delete called ")
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))  
  
})

// Mongoose save a new note
app.post('/api/notes', (request, responsea, next) => {
  const body = request.body


  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  // If the document failes to save, an exception is thrown, which is passed to the error-handler
  note.save()
    .then(savedNote => response.json(savedNote))
    .catch(error => next(error))

})

// Mongoose savebyid and update
app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


// Error handling middleware must be loaded after all the routes.
// Error handlers take four parameters. 
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // For handling 'cast error' where the request contains bad formatting
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  // For handling a mongoose validation error
  if (error.name === 'ValidationError'){
    return response.status(400).json({error: error})
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)


// environemnt variable is saved in .env file, which is processed and loaded into application using dotenv
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on http://${PORT}`);
});