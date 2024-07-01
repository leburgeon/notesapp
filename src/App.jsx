import Note from './components/Note'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NotesDisplay from './components/NotesDisplay'
import NoteForm from './components/NoteForm'
import ShowButton from './components/ShowButton'


const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)


  useEffect(() => {
    console.log('effect')
    axios.get('http://localhost:3001/notes')
    .then(response => {
      console.log("Promise fulfilled")
      setNotes(response.data)
    })
  }, [])

  // For generating the list of notes to show 
  const notesToShow = showAll
    ? notes 
    : notes.filter(note => note.important)

  // Controller for new note input
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  // Event handler for adding a new note to the server
  const handleNewNote = (event) => {
    event.preventDefault()
    // New json note to add to server
    // Id omitted to let the server generate the id
    const newNoteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }
    axios
    .post('http://localhost:3001/notes', newNoteObject)
    .then(response => {
      console.log(response)
    })
  }

  return (
    <div>
      <h1>Notes</h1>
      <div> 
        <ShowButton showAll={showAll} setShowAll={setShowAll}/>
      </div>
      <NotesDisplay notesToShow={notesToShow}/>
      <NoteForm newNote={newNote} handleNewNote={handleNewNote} handleNoteChange={handleNoteChange}/>
    </div>
  )
}

export default App