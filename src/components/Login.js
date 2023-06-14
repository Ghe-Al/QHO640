import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const emailHandler = (event) => {
    setEmail(event.target.value)
  }

  const passwordHandler = (event) => {
    setPassword(event.target.value)
  }

  const submitHandler = (event) => {
    event.preventDefault()
    loginRequest()
  }

  async function loginRequest() {
    try {
      await fetch('http://localhost:3001/php/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((respose) => {
          console.log("error")
          if (respose.ok) {
            return respose.json()
          }
          throw new Error('error')
        })
        .then((data) => {
          if (data.status) {
            localStorage.setItem('token', data.status)
            navigate('/')
            navigate(0)
          }
        })
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div>
      <form className="login-form" onSubmit={submitHandler}>
        <h1>Login</h1>
        <label>Email:</label>
        <input type="text" value={email} onChange={emailHandler} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={passwordHandler} required />
        <button>Join<img className="checkmark" src={require('../images/Checkmark.png')} /></button>
        <Link to="/register">Or register here</Link>
      </form>
    </div>
  )
}