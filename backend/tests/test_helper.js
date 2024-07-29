const Note = require('../models/note')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
    user: null
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
    user: null
  }
]

const initialiseDatabase = async () =>{
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({username: 'groot', passwordHash})
  await user.save()

  initialNotes.forEach(note => {
    note.user = user._id
  })

  await Note.deleteMany({})
  await Note.insertMany(initialNotes)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const validUserId = async () => {
  const notes = await Note.find({})
  return notes[0].toJSON().user
}

module.exports = { initialNotes, nonExistingId, notesInDb, usersInDb, initialiseDatabase, validUserId
}