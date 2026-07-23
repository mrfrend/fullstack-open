import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const sortedBlogs = blogs.sort((a, b) => -(a.likes - b.likes))
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async credentials => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('user', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch {
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleBlogCreation = async blogData => {
    try {
      const createdBlog = await blogService.create(blogData)
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

  const handleBlogLike = async (id, blogData) => {
    const newBlogData = { ...blogData, likes: blogData.likes + 1 }
    try {
      const updatedBlog = await blogService.update(id, newBlogData)
      const newBlogs = blogs.map(blog =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
      setBlogs(newBlogs)
    } catch (e) {
      setMessage(e.response.data.error)
      setIsError(true)
    } finally {
      setTimeout(() => {
        setMessage(null)
        setIsError(false)
      }, 5000)
    }
  }

  const handleBlogDelete = async id => {
    try {
      await blogService.remove(id)
      const newBlogs = blogs.filter(blog => blog.id !== id)
      setBlogs(newBlogs)
      setMessage('blog was deleted!')
    } catch (e) {
      setMessage(e.response.data.error)
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
      <LoginForm onSubmit={handleSubmit} />
    </>
  )

  const loggedUser = () => (
    <>
      <h2>blogs</h2>
      <p>
        user {user.username} logged in{' '}
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='create new blog'>
        <BlogForm onSubmit={handleBlogCreation} />
      </Togglable>
      {sortedBlogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          onLike={handleBlogLike}
          onDelete={handleBlogDelete}
        />
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
