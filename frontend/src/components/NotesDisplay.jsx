import Note from "./Note"

const NotesDisplay = ({ notesToShow, toggleImportanceOf }) => {
    console.log("foo:", notesToShow)
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