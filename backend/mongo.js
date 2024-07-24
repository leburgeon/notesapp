const mongoose = require('mongoose')

if (process.argv.length<3){
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const databaseName = 'testNoteApp'

const url = `mongodb+srv://lewisburgess:${password}@fsocluster.z2ocxgx.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=FSOcluster`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
})

// MongoDB allows documents to have any field in a collection, and are schemaless
// Mongo enforces the schema at the application level to ensure that objects in a collection adhere to a schema
const Note = mongoose.model('Note', noteSchema)

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

