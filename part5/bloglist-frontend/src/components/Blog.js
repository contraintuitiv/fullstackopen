import React from 'react'
import Togglable from './Toggleable'
const Blog = ({ blog, likeBlog, deleteBlog, deleteVisible }) => {

  return(
    <li className='blog'>
      <a href={blog.url}>{blog.title}</a> <button onClick={() => likeBlog(blog)}>like</button>

      <Togglable buttonLabel="view" closeButtonLabel="hide">
        <p className='author'>{blog.author}</p>
        <div>likes:</div> <div className='likeCounter'>{blog.likes || 0}</div>
        {deleteVisible?<button onClick={() => deleteBlog(blog.id)}>delete</button>:''}
      </Togglable><br /><br />

    </li>
  )
}



export default Blog