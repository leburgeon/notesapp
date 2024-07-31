const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // jwt.sign method takes the user and concats header and payload to create signature with provided string.
  // Expires in 28800 seconds (8h)
  const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 28800})

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter