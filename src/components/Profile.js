import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import jwt from 'jwt-decode'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const userToken = jwt(localStorage.getItem('token'))

  if (!username) {
    if(user === undefined) {
      setUsername(userToken.user.username)
    } else {
      setUsername(user.username)
    }
  }

  if (!email) {
    if(user === undefined) {
      setEmail(userToken.user.email)
    } else {
      setEmail(user.email)
    }
  }

  const getUser = useCallback(async () => {
    try {
      await fetch('http://localhost:3001/php/api/user', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
        .then((respose) => {
          if (respose.ok) {
            return respose.json()
          }
          throw new Error('error')
        })
        .then((data) => {
          setUser(data.status)
        })
    } catch (error) {
      console.log(error.message)
    }
  }, [])

  useEffect(() => {
    getUser()
  }, [getUser])

  async function updateRequest() {
    try {
      await fetch('http://localhost:3001/php/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email
        }),
      })
        .then((respose) => {
          if (respose.ok) {
            return respose.json()
          }
          throw new Error('error')
        })
        .then((data) => {
          console.log(data)
          if (data.status) {
            localStorage.setItem('token', data.status)
            navigate('/success')
            navigate(0)
          }
        })
    } catch (error) {
      console.log(error.message)
    }
  }

  const submitHandler = (event) => {
    event.preventDefault()
    updateRequest()
  }

  const usernameHandler = (event) => {
    setUsername(event.target.value)
  }

  const passwordHandler = (event) => {
    setPassword(event.target.value)
  }

  const emailHandler = (event) => {
    setEmail(event.target.value)
  }

  function navbar() {
    var x = document.getElementById("navLinks");
    console.log(x)
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

  return (
    <form className="profile" onSubmit={submitHandler}>
      <div className="topnav">
        <a href="javascript:void(0);" className="icon" onClick={navbar}><i className="fa fa-bars"></i></a>
        <Link to="/profile" className="userdisplay">{username}</Link>
        <div id="navLinks">
          <Link to="/">Main</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/logout">Logout</Link>
        </div>
      </div>
      <h2>Profile</h2>
      {user && (
        <>
          <label>Username:</label>
          <input type="text" value={username} onChange={usernameHandler} required/>
          <label>Email:</label>
          <input type="text" value={email} onChange={emailHandler} required/>
          <label>Password:</label>
          <input type="password" onChange={passwordHandler} required/>
        </>
      )}
      {userToken && (
        <>
          <label>Username:</label>
          <input type="text" value={username} onChange={usernameHandler} required/>
          <label>Email:</label>
          <input type="text" value={email} onChange={emailHandler} required/>
          <label>Password:</label>
          <input type="password" onChange={passwordHandler} required/>
        </>
      )}
      <button>Change<img className="checkmark" src={require('../images/Checkmark.png')} /></button>
      <Link to="/">Go back.</Link>
    </form>
  )
}