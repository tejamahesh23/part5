import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import './index.css'
import PropTypes from 'prop-types'

const NewNote = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const newBlogObj = {
      author, title, url
    }

    createBlog(newBlogObj)
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>title:<input id="title" value={title} onChange={({ target }) => setTitle(target.value)} /></div>
        <div>author:<input id="author" value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
        <div>url:<input id="url" value={url} onChange={({ target }) => setUrl(target.value)} /></div>
        <button type="submit" id="create-blog">create</button>
      </form>
    </>
  )
}

NewNote.propTypes = {
  createBlog: PropTypes.func.isRequired
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)
  const [errorState, setErrorState] = useState('success')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)

      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong credentials')
      setErrorState('error')
      setUsername('')
      setPassword('')
      setTimeout(() => {
        setMessage(null)
        setErrorState('success')
      }, 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const createBlog = (newBlogObj) => {
    blogService.create(newBlogObj).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
      setErrorState('success')
      setMessage(`A new Blog ${returnedBlog.title} was added by ${returnedBlog.author}`)
      setTimeout(() => {
        setMessage(null)
        setErrorState('success')
      }, 5000)
    })
  }

  if (user == null) {
    return (
      <>
        <Notification message={message} errorState={errorState} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username<input type="text" value={username} id="username" name="Username" onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password<input type="password" value={password} id="password" name="Password" onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit" id="login-button">login</button>
        </form>

      </>
    )
  } else {
    return (
      <>
        <h2>blogs</h2>
        <div>{user.name} is logged in</div>
        <button onClick={logout}>logout</button>
        <Notification message={message} errorState={errorState} />
        <br />
        <Togglable buttonLabel="new blog">
          <NewNote createBlog={createBlog} />
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} />
        )}
      </>
    )
  }
}

export default App