import { useState } from 'react'
const LoginForm = ({ onSubmit }) => {
  const [usernameValue, setUsernameValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  const loginAction = e => {
    e.preventDefault()
    onSubmit({ username: usernameValue, password: passwordValue })
    setUsernameValue('')
    setPasswordValue('')
  }

  return (
    <form onSubmit={loginAction}>
      <div>
        <label htmlFor='username'>
          username
          <input
            value={usernameValue}
            onChange={e => setUsernameValue(e.target.value)}
            id='username'
            name='username'
          />
        </label>
      </div>
      <div>
        <label htmlFor='password'>
          password
          <input
            value={passwordValue}
            onChange={e => setPasswordValue(e.target.value)}
            id='password'
            name='password'
          />
        </label>
      </div>
      <button>login</button>
    </form>
  )
}

export default LoginForm
