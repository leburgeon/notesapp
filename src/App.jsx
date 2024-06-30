import Note from './components/Note'
import { useState } from 'react'


const App = (props) => {
  // States representing the value of the input field and the array of notes
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState("a new note...")
  // Piece of state indicating if all notes should be shown
  const [showAll, setShowAll] = useState(false)

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