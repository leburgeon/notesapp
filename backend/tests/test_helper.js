const Note = require('../models/note')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

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

const initialUser = {
  username: 'groot',
  name: 'foo',
  password: 'BigStr0ng5ecre!t'
}

const initialiseDatabase = async () =>{
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash(initialUser.password, 10)
  const user = new User({username: initialUser.username, name:initialUser.name, passwordHash})
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
  const validId = await validUserId()
  const note = new Note({ content: 'willremovethissoon', user: validId})
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({}).populate('user', {username: 1, name: 1})
  return notes.map(note => note.toJSON())
}

const validUserId = async () => {
  const user = await User.findOne({})
  return user._id
}

const getFirstUser = async () => {
  const users = await usersInDb();
  return users[0];
};

const oneMinuteToken = async () => {
  const { username, id } = await getFirstUser();
  return jwt.sign({ id, username }, config.SECRET, { expiresIn: 60 });
};

module.exports = { initialUser, initialNotes, nonExistingId, notesInDb, usersInDb, initialiseDatabase, validUserId, oneMinuteToken
}