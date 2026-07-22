const BlogForm = ({ onSubmit, form }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>
          title:
          <input
            value={form.title}
            onChange={form.onTitleChange}
            name='title'
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            value={form.author}
            onChange={form.onAuthorChange}
            name='author'
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input value={form.url} onChange={form.onUrlChange} name='url' />
        </label>
      </div>
      <button>create</button>
    </form>
  )
}

export default BlogForm
