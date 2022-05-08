import React, { useState } from 'react'

const CreateBlog = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = { author,title,url }

    createBlog(newBlog)

    setTitle('')
    setAuthor('')
    setUrl('')

  }

  return(<div>
    <form onSubmit={addBlog}>
      <h3>create new blog</h3>
      <input type="text" placeholder="Title" value={title} onChange={({ target }) => setTitle(target.value)} />
      <input type="text" placeholder="Author" value={author} onChange={({ target }) => setAuthor(target.value)} />
      <input type="text" placeholder="URL" value={url} onChange={({ target }) => setUrl(target.value)} />
      <button type="submit">add</button>
    </form>
  </div>)
}

export default CreateBlog