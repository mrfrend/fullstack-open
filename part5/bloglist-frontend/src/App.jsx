import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [usernameValue, setUsernameValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleUsernameChange = e => setUsernameValue(e.target.value)
  const handlePasswordChange = e => setPasswordValue(e.target.value)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const user = await loginService.login({
        username: usernameValue,
        password: passwordValue
      })
      window.localStorage.setItem('user', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsernameValue('')
      setPasswordValue('')
    } catch {
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleBlogCreation = async e => {
    e.preventDefault()
    try {
      const createdBlog = await blogService.create({
        title,
        author,
        url
      })
      setBlogs([...blogs, createdBlog])
      setMessage(
        `a new blog ${createdBlog.title} by ${createdBlog.author} created!`
      )
    } catch (error) {
      setMessage(error.response.data.error)
      setIsError(true)
    } finally {
      setTimeout(() => {
        setMessage(null)
        setIsError(false)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('user')
    setUser(null)
  }

  const notLoggedUser = () => (
    <>
      <h2>Log in to application</h2>
      <LoginForm
        onSubmit={handleSubmit}
        usernameValue={usernameValue}
        passwordValue={passwordValue}
        onUserChange={handleUsernameChange}
        onPassChange={handlePasswordChange}
      />
    </>
  )

  const loggedUser = () => (
    <>
      <h2>blogs</h2>
      <p>
        user {user.username} logged in{' '}
        <button onClick={handleLogout}>logout</button>
      </p>
      <BlogForm
        onSubmit={handleBlogCreation}
        form={{
          title,
          author,
          url,
          onTitleChange: e => setTitle(e.target.value),
          onUrlChange: e => setUrl(e.target.value),
          onAuthorChange: e => setAuthor(e.target.value)
        }}
      />
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  )

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const storedUser = window.localStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <div>
      {message && <Notification message={message} isError={isError} />}
      {user && loggedUser()}
      {!user && notLoggedUser()}
    </div>
  )
}

export default App
