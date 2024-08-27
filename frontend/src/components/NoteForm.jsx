import { useState } from 'react'

const NoteForm = ( { addNote }) => {
  const [newNote, setNewNote] = useState('')

  const createNote = (event) => {
    event.preventDefault()

    addNote({
      content: newNote,
      important: true
    })

    setNewNote('')
  }
  return (
    <div className='formDiv'>
      <h2>Create a new note</h2>
      <form onSubmit={createNote}>
        <input
          value={newNote}
          onChange={({ target }) => setNewNote(target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm