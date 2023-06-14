import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const usernameHandler = (event) => {
    setUsername(event.target.value)
  }

  const passwordHandler = (event) => {
    setPassword(event.target.value)
  }

  const emailHandler = (event) => {
    setEmail(event.target.value)
  }

  async function registerRequest() {
    try {
      await fetch('http://localhost:3001/php/api/register', {
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
    registerRequest()
  }

  return (
    <form className="register-form" onSubmit={submitHandler}>
      <h2>Register</h2>
      <label>Username:</label>
      <input type="text" value={username} onChange={usernameHandler} required />
      <label>Password:</label>
      <input type="password" value={password} onChange={passwordHandler} required />
      <label>Email:</label>
      <input type="text" value={email} onChange={emailHandler} required />
      <button>Join<img className="checkmark" src={require('../images/Checkmark.png')} /></button>
      <Link to="/login">Already a member ? - Login</Link>
    </form>
  )
}