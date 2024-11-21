const Note = ({ note, toggleImportance }) => {
  return (
    <li className="note">
      <strong>
        {note.important? 'Important: ' : 'Unimportant: '}
      </strong>
      <span>
        {note.content}
      </span>
      <button data-testid={'toggleButton'} onClick={toggleImportance}>
        {note.important? 'Make not important' : 'Make important'}
      </button>
    </li>
  )
}

export default Note