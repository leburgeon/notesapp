const Note = ({ note }) => {
    return (
      <li>{note.content} <div>
        -{note.important? "Important" : "Not Important"}</div></li>
    )
  }
  
  export default Note