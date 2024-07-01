import Note from "./Note"

const NotesDisplay = ({ notesToShow }) => {
    console.log("Notes display rendered")
    return (
        <>
            {notesToShow.map((note) => 
        <Note key={note.id} note={note}/>)}
        </>
    )
}

export default NotesDisplay