import Note from './components/Note'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NotesDisplay from './components/NotesDisplay'
import NoteForm from './components/NoteForm'
import ShowButton from './components/ShowButton'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'


const App = (props) => {
  // State for the notes to display
  const [notes, setNotes] = useState([])
  // State for controlling the new note input value
  const [newNote, setNewNote] = useState("")
  // State for maintaining importance filter
  const [showAll, setShowAll] = useState(true)
  // Piece of state for the error message
  const [errorMessage, setErrorMessage] = useState(null)


  // Effect hook for fetching the notes data from server
  useEffect(() => {
    // noteService from the notes.js module returns a promise that will fulfill or reject and return a result
    // .then() called on the promise which takes a callback to deal with the returned result 
    // the response data is used to update the state responsible for displaying the notes data
    noteService
      .getAll()
      .then(initialData => {
        setNotes(initialData)
      })
  }, [])

  // For generating the list of notes to show based on the showAll filter
  const notesToShow = showAll
    ? notes 
    : notes.filter(note => note.important)

  // Controller for new note input component
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  // Event handler for adding a new note to the server using axios post request
  const handleNewNote = (event) => {
    event.preventDefault()
    // New json note to add to server
    // Id omitted to let the server generate the id
    const newNoteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }

    // create method from the notes.js module takes the new note object and internally uses Axoios to make a post request
    // create returns a promise that if fulfilled returns the response from the post request
    // response appeneded to a copy of the notes, which is used to update the state responsible for displaying the notes
    noteService
      .create(newNoteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  
  // Definition of a callback that takes an id and handles a database update for that note
  const toggleImportanceOf = (id) => {
    // Finds id from array of notes in the app state
    const note = notes.find(note => note.id === id);
    // Creates a spread copy (shallow) and changes the relevant property
    const changedNote = {...note, important: !note.important}

    // update function in the notes service takes an id and the updated object
    // this function makes a put request to the server for the object at the given id
    // promise returned, if fulfilled, returns a response with the replaced note object at the given id
    noteService
      .update(id, changedNote)
      .then(changedNote => 
        // This call updates the notes with the updated note, using the id to identify it in the notes array
        setNotes(notes.map(note => note.id !== id ? note : changedNote))
      ).catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(note => note.id !== id))
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div> 
        <ShowButton showAll={showAll} setShowAll={setShowAll}/>
      </div>
      <NotesDisplay notesToShow={notesToShow} toggleImportanceOf={toggleImportanceOf}/>
      <NoteForm newNote={newNote} handleNewNote={handleNewNote} handleNoteChange={handleNoteChange}/>
      <Footer/>
    </div>
  )
}

export default App