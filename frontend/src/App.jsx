import { useState, useEffect, useRef } from 'react'
import NotesDisplay from './components/NotesDisplay'
import NoteForm from './components/NoteForm'
import ShowButton from './components/ShowButton'
import noteService from './services/notes'
import Notification from './components/Notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'



const App = () => {
  // State for the notes to display
  const [notes, setNotes] = useState([])
  // State for maintaining importance filter
  const [showAll, setShowAll] = useState(true)
  // Piece of state for the error message
  const [errorMessage, setErrorMessage] = useState(null)
  // Piece of state for storing the user
  const [user, setUser] = useState(null)
  // Ref for the noteForm
  const noteFormRef = useRef()

  // Method for handling logging in
  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorMessage('Wrong credz')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // Effect hook for checking if data for a logged-in user exist in the localStorage
  // Empty array of dependencies only calls the effect after the first render of the object
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  // Effect hook for fetching the notes data from server
  useEffect(() => {
    // noteService from the notes.js module returns a promise that will fulfill or reject and return a result
    // .then() called on the promise which takes a callback to deal with the returned result
    // the response data is used to update the state responsible for displaying the notes data
    noteService
      .getAll()
      .then(initialData => {
        setNotes(initialData)
      })
  }, [])

  // For logging the user out
  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedNoteappUser')
    noteService.setToken(null)
  }

  // For generating the login form
  const loginForm = () => {
    return (
      <Togglable buttonLabel={'Login'}>
        <LoginForm handleLogin={handleLogin} />
      </Togglable>
    )
  }

  // Generates the form component for adding a new note
  const notesForm = () => (
    <Togglable buttonLabel={'add note'} ref={noteFormRef}>
      <NoteForm addNote={addNote}/>
    </Togglable>
  )

  // Generates the display for the notes as a *functional component*
  const notesDisplay = () => (
    <>
      <p>{user.name} logged-in</p>
      <button onClick={logout}>Logout</button>
      <div>
        <ShowButton showAll={showAll} setShowAll={setShowAll}/>
      </div>
      <NotesDisplay notesToShow={notesToShow} toggleImportanceOf={toggleImportanceOf}/>
    </>
  )

  // For generating the list of notes to show based on the showAll filter
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)


  // Method for adding a new note object using the note service
  const addNote = (newNoteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(newNoteObject)
      .then(returnedNote => {
        setNotes(oldNotes => [...oldNotes, returnedNote])
      })
  }

  // Definition of a callback that takes an id and handles a database update for that note
  const toggleImportanceOf = (id) => {
    // Finds id from array of notes in the app state
    const note = notes.find(note => note.id === id)
    // Creates a spread copy (shallow) and changes the relevant property
    const changedNote = { ...note, important: !note.important }

    // update function in the notes service takes an id and the updated object
    // this function makes a put request to the server for the object at the given id
    // promise returned, if fulfilled, returns a response with the replaced note object at the given id
    noteService
      .update(id, changedNote)
      .then(changedNote =>
        // This call updates the notes with the updated note, using the id to identify it in the notes array
        setNotes(notes.map(note => note.id !== id ? note : changedNote))
      ).catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(note => note.id !== id))
      })
  }

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage}/>

      {/* This is a simplified ternary operator for conditionally rendering components only when a condition is true */}

      {user === null && loginForm()}

      {user !== null && notesDisplay()}
      {user !== null && notesForm()}

      <div>Note app created during UoH FSO</div>

    </div>
  )
}

export default App