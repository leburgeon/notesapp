import Note from "./Note"

const NotesDisplay = ({ notesToShow, toggleImportanceOf }) => {
    return (
        <>
            {notesToShow.map((note) => 
        <Note 
            key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}/>)}
        </>
    )
}

export default NotesDisplay