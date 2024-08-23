const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    validate: {
      validator: (username) => {
        const regex = /^[a-zA-Z0-9]+$/
        return regex.test(username)
      },
      message: 'Only letters and numbers allowed in username'
    }
  },
  name: String,
  passwordHash: String, 
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})

// Sets the toJSON method for documents created with the user schema
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User