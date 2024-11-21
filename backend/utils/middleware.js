const logger = require('./logger')
const { passwordStrength } = require('check-password-strength')
require('express-async-errors')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
    return response.status(400).json({ error: 'expected `username` to be unique'})
  } else if (error.name === 'UserCreationError'){
    return response.status(400).json({error: error.message})
  } else if (error.name === 'JsonWebTokenError'){
    return response.status(401).json({error: 'token invalid'})
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({error: 'token expired'})
  }

  next(error)
}

const passwordValidator = (req, res, next) => {
  if (req.method === "POST"){
    const password = req.body.password;
    if (!password){
      const passwordError = new Error('Password is required')
      passwordError.name = 'UserCreationError'
      return next(passwordError)
    }
    const strength = passwordStrength(password).id;
    if (strength < 2) {
      const passwordError = new Error('Password too weak');
      passwordError.name = 'UserCreationError';
      return next(passwordError);
    }
  }

  next();
};

// This method takes an express request, sent to server by the browser, strips the auth scheme and returns the token
const getTokenFrom = req => {
  // Express request object get method returns the specified header field
  const authorisation = req.get('authorization')
  if (authorisation && authorisation.startsWith('Bearer ')){
    return authorisation.replace('Bearer ', '')
  }
  return null
}

const extractUser = async (req, res, next) => {
  const token = getTokenFrom(req)
  const decoded = jwt.verify(token, process.env.SECRET)

  // If the token was not varified using the secret, returning null, or the token does not contain an id field, the token is invalid
  // Validation of signature is done by reconcatinating the header and payload, and rehashing using the secret. if the signature is the same, the token is valid (was produced by the server)
  if (!decoded.id) {
    return res.status(401).json({error: 'invalid token'})
  }

  const user = await User.findById(decoded.id)

  if (!user){
    return res.status(401).json({error: 'user no long exists, please re-login'}).end()
  }

  req.body.user = user
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  passwordValidator,
  extractUser
}