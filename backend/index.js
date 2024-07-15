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

app.use(express.static('dist'))

const mongoURI = 'mongodb+srv://lewisburgess:!K9d_85NFr!3ebn@fsocluster.z2ocxgx.mongodb.net/?retryWrites=true&w=majority&appName=FSOcluster'

// Custom middlewear function for logging the req infos
const middleLoggMaker = (req, res, next) => {
  console.log(req.method)
  console.log(req.path)
  console.log(req.body)
  next()
}

app.use(middleLoggMaker)

let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

// Route mapping for the root url
app.get('/', (_request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (_request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)

  if (note){
    response.json(note)
  } else {
    response.statusMessage = "That knot could note be found!";
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  console.log("delete alled ")
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)
  response.status(204).end() 
})

// Method for generating an id
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is running on http://${PORT}`);
});