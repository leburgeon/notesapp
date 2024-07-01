const NoteForm = ( { handleNewNote, newNote, handleNoteChange }) => {
    return (
        <form onSubmit={handleNewNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
    )
}

export default NoteForm