import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import jwt from 'jwt-decode'

export default function Appoint() {
  const { state } = useLocation()
  const [eventName, setEventName] = useState('')
  const [hallNumber, setHallNumber] = useState('')
  const [eventType, setEventType] = useState('Review')
  const [comments, setComments] = useState('')
  const navigate = useNavigate()
  var dateValue = new Date() 

  const eventNameHandler = (event) => {
    setEventName(event.target.value)
  }

  const hallNumberHandler = (event) => {
    setHallNumber(event.target.value)
  }

  const eventTypeHandler = (event) => {
    setEventType(event.target.value)
  }

  const commentsHandler = (event) => {
    setComments(event.target.value)
  }

  if(state != null) { dateValue = state }

  var userToken = undefined
  var username = ""

  if(localStorage.getItem('token')) {
    userToken = jwt(localStorage.getItem('token'))
    username = userToken.user.username
  }

  async function appointRequest() {
    try {
      await fetch('http://localhost:3001/php/api/appoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          eventName: eventName,
          hallNumber: hallNumber,
          eventType: eventType,
          comments: comments,
          date: dateValue.toISOString().slice(0, 19).replace('T', ' '),
        }).replace(/ /g, "%20"),
      })
        .then((respose) => {
          if (respose.ok) {
            return respose.json()
          }
          throw new Error('error')
        })
        .then((data) => {
          if (data.status) {
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
    appointRequest()
  }

  function navbar() {
    var x = document.getElementById("navLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

  return (
    <form className="appoint-form" onSubmit={submitHandler}>
      <div className="topnav">
        <a className="icon" onClick={navbar}><i className="fa fa-bars"></i></a>
        <Link to="/profile" className="userdisplay">{username}</Link>
        <div id="navLinks">
          <Link to="/">Main</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/logout">Logout</Link>
        </div>
      </div>

      <h1>Appoint</h1>
      
      <label className="appointLabel">Event name:</label>
      <input className="appointInput" type="text" onChange={eventNameHandler} required />
      <label className="appointLabel">Hall number:</label>
      <input className="appointInput" type="number" onChange={hallNumberHandler} placeholder="101" min="0" max="999" required />
      <label className="appointLabel">Meeting type:</label>
      
      <span className="appointRadio">
        <input type="radio" onChange={eventTypeHandler} id="Review" name="MeetType" value="Review" checked />
        <label htmlFor="Review">Review</label>
        <input type="radio" onChange={eventTypeHandler} id="Lecture" name="MeetType" value="Lecture" />
        <label htmlFor="Lecture">Lecture</label>
      </span>

      <label className="appointLabel">Comments:</label>
      <textarea className="commentsInput" onChange={commentsHandler} placeholder="145 characters max." rows="4" cols="50" maxLength="145" required />

      <button className="appointButton">Appoint<img className="checkmark" src={require('../images/Checkmark.png')} /></button>
    </form>
  )
}