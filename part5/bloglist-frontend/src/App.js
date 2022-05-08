import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const likedBlogs = blogs.map(blog => ({ ...blog, likes:(blog.likes>=0?blog.likes:0) }))
      setBlogs(likedBlogs.sort((a, b) => b.likes-a.likes))
    })
  }, [])

  const loginHandler = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login( {
        username, password
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    }catch (error){
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)

    }
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs (blogs.concat(createdBlog))

      blogFormRef.current.toggleVisibility()

      setSuccessMessage(`Blog '${createdBlog.title}' was created`)
      setTimeout(() => setSuccessMessage(null), 5000)

    } catch (error) {
      setErrorMessage('Didn\'t work, check your input!')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const likeBlog = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject, { likes: blogObject.likes+1 })

      const updatedBlogs = blogs.map(blog => (blog.id===updatedBlog.id)?updatedBlog:blog )
      setBlogs (updatedBlogs.sort((a, b) => b.likes - a.likes))
    } catch (error) {
      setErrorMessage('Like didn\'t work...')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const deleteBlog = async (blogId) => {
    try {
      blogService.remove(blogId).then( () => {
        const updatedBlogs = blogs.filter(blog => blog.id!==blogId)
        setBlogs(updatedBlogs)
      })

    } catch (error) {
      setErrorMessage('couldn\'t delete blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  if(user===null){
    return (
      <div>
        <Notification message={errorMessage} type="error" />
        <form method="post" onSubmit={loginHandler}>
          <input type="text" placeholder="Username" value={username} onChange={({ target }) => setUsername(target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={({ target }) => setPassword(target.value)} />
          <button type="submit">login</button>
        </form>
      </div>)
  }



  return (
    <div>
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />
      <h2>blogs</h2>
      <p>
        Logged in user: {user.name} <button onClick={logoutHandler}>logout</button>
      </p>
      <Togglable buttonLabel="New Blog" closeButtonLabel="close" ref={blogFormRef}>
        <CreateBlog
          createBlog={addBlog}
        />
      </Togglable>
      <div>
        <ul>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} deleteVisible={user.id===blog.user.id?true:false} />
          )}
        </ul>
      </div>
    </div>
  )
}

export default App