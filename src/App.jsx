import Note from './components/Note'
import { useState, useEffect } from 'react'
import axios from 'axios'


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

  console.log('render', notes.length, 'notes')

  // For generating the list of notes to show 
  const notesToShow = showAll
    ? notes 
    : notes.filter(note => note.important)

  // Component controller
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  // Event handler for adding a new note to the notes array state
  const handleNewNote = (event) => {
    event.preventDefault()
    const newNoteObject = {
      id: notes.length + 1,
      content: newNote,
      important: Math.random() < 0.5
    }
    setNotes(notes.concat(newNoteObject))
    setNewNote("")
  }

  return (
    <div>
      <h1>Notes</h1>
      <div> 
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => 
        <Note key={note.id} note={note}/>)}
      </ul>
      <form onSubmit={handleNewNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App