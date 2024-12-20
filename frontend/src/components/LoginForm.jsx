import { useState } from 'react'

const LoginForm = ({
  handleLogin }) => {
  // Piece of state for controlling username input
  const [username, setUsername] = useState('')
  // Piece of state for controlling password input
  const [password, setPassword] = useState('')

  const login = event => {
    event.preventDefault()
    handleLogin({ username, password })
  }

  return (
    <form onSubmit={login}>
      <div>
          username
        <br></br>
        <input
          data-testid='username'
          type='text'
          value={username}
          name='Username'
          autoComplete='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
          password
        <br></br>
        <input
          data-testid='password'
          type='password'
          value={password}
          name='Password'
          autoComplete='current-password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button data-testid='loginButton' type='Submit'>Login</button>
    </form>
  )
}

export default LoginForm