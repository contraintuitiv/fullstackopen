import React from 'react'
import Togglable from './Toggleable'
const Blog = ({ blog, likeBlog, deleteBlog, deleteVisible }) => {

  return(
    <div>
      <li>
        <a href={blog.url}>{blog.title}</a> <button onClick={() => likeBlog(blog)}>like</button>

        <Togglable buttonLabel="view" closeButtonLabel="hide">
          {blog.author}<br />
        likes: {blog.likes}
          {deleteVisible?<button onClick={() => deleteBlog(blog.id)}>delete</button>:''}
        </Togglable><br /><br />

      </li>
    </div>
  )
}


export default Blog