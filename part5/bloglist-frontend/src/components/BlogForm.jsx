import { useState } from 'react'
const BlogForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = event => {
    event.preventDefault()
    onSubmit({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={createBlog}>
      <div>
        <label>
          title:
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            name='title'
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            name='author'
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            name='url'
          />
        </label>
      </div>
      <button>create</button>
    </form>
  )
}

export default BlogForm
