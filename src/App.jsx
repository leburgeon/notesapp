import Note from './components/Note'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NotesDisplay from './components/NotesDisplay'
import NoteForm from './components/NoteForm'
import ShowButton from './components/ShowButton'
import noteService from './services/notes'


const App = (props) => {
  // States
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)


  // Effect hook for fetching the notes data from server
  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })
  }, [])
  // For generating the list of notes to show based on the showall filter
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
    // Axios post request returns promise
    noteService
      .create(newNoteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }
  
  // Event handler for toggling note importance
  const toggleImportanceOf = (id) => {
    const note = notes.find(note => note.id === id);
    const changedNote = {...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(response => 
        setNotes(notes.map(note => note.id !== id ? note : response.data))
      )
  }

  return (
    <div>
      <h1>Notes</h1>
      <div> 
        <ShowButton showAll={showAll} setShowAll={setShowAll}/>
      </div>
      <NotesDisplay notesToShow={notesToShow} toggleImportanceOf={toggleImportanceOf}/>
      <NoteForm newNote={newNote} handleNewNote={handleNewNote} handleNoteChange={handleNoteChange}/>
    </div>
  )
}

export default App