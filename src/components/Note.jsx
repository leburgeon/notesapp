const Note = ({ note, toggleImportance }) => {
  const label = note.important? "Make not important" : "Make important";
    return (
      <li className="note"><strong>{note.important? "Important: " : "Unimportant: "}</strong>{note.content + "  "}
          <button onClick={toggleImportance}>{label}</button>
      </li>
    )
  }
  
  export default Note