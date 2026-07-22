const LoginForm = ({
  usernameValue,
  passwordValue,
  onUserChange,
  onPassChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor='username'>
          username
          <input
            value={usernameValue}
            onChange={onUserChange}
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
            onChange={onPassChange}
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
