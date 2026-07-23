import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete }) => {
  const [isVisible, setIsVisible] = useState(false)
  const handleLikeClick = () => {
    onLike(blog.id, blog)
  }
  const handleDelete = () => {
    const isAffirmative = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )
    if (isAffirmative) {
      onDelete(blog.id)
    }
  }
  return (
    <div className='blog'>
      {blog.title} {blog.author}{' '}
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'hide' : 'view'}
      </button>
      {isVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={handleLikeClick}>like</button>
          </div>
          <div>{blog.author}</div>
          <button onClick={handleDelete}>remove</button>
        </div>
      )}
    </div>
  )
}

export default Blog
