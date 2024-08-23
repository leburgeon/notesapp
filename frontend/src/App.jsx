import { useState, useEffect } from 'react'
import NotesDisplay from './components/NotesDisplay'
import NoteForm from './components/NoteForm'
import ShowButton from './components/ShowButton'
import noteService from './services/notes'
import Notification from './components/Notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'


const App = () => {
  // State for the notes to display
  const [notes, setNotes] = useState([])
  // State for controlling the new note input value
  const [newNote, setNewNote] = useState("")
  // State for maintaining importance filter
  const [showAll, setShowAll] = useState(true)
  // Piece of state for the error message
  const [errorMessage, setErrorMessage] = useState(null)
  // Piece of state for controlling username input
  const [username, setUsername] = useState('')
  // Piece of state for controlling password input
  const [password, setPassword] = useState('')
  // Piece of state for storing the user
  const [user, setUser] = useState(null)

  // Method for handling logging in
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
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
  const loginForm = () => (
    <LoginForm password={password} 
      username={username} setPassword={setPassword} 
      setUsername={setUsername} handleLogin={handleLogin} />
  )

  // Generates the form component for adding a new note
  const notesForm = () => (
    <NoteForm newNote={newNote} handleNewNote={handleNewNote} handleNoteChange={({target}) => setNewNote(target.value)}/>
  )

  // Generates the display for the notes as a *functional component* 
  const notesDisplay = () => (
    <>
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


  // Event handler for adding a new note to the server using axios post request
  const handleNewNote = (event) => {
    event.preventDefault()
    // New json note to add to server
    // Id omitted to let the server generate the id
    const newNoteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }

    // create method from the notes.js module takes the new note object and internally uses Axoios to make a post request
    // create returns a promise that if fulfilled returns the response from the post request
    // response appeneded to a copy of the notes, which is used to update the state responsible for displaying the notes
    noteService
      .create(newNoteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  
  // Definition of a callback that takes an id and handles a database update for that note
  const toggleImportanceOf = (id) => {
    // Finds id from array of notes in the app state
    const note = notes.find(note => note.id === id);
    // Creates a spread copy (shallow) and changes the relevant property
    const changedNote = {...note, important: !note.important}

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
      {
        user === null 
          ? loginForm()
          : <div>
            <p>{user.name} logged-in</p>
            <button onClick={logout}>Logout</button>
            {notesDisplay()}
            {notesForm()}
          </div>
      }
    </div>
  )
}

export default App