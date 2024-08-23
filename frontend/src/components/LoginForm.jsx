const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
  return (
    <form onSubmit={handleLogin}>
        <div>
          username
          <br></br>
          <input
            type='text'
            value={username}
            name='Username'
            autoComplete='username'
            onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <br></br>
          <input
            type='password'
            value={password}
            name='Password'
            autoComplete='current-password'
            onChange={({target}) => setPassword(target.value)}
          />
        </div>
        <button type='Submit'>Login</button>
      </form>
  )
}

export default LoginForm