import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import jwt from 'jwt-decode'

export default function Profile() {
  const { state } = useLocation()
  const navigate = useNavigate()

  var userToken = undefined
  var username = ""
  var event = ""

  console.log(state)

  if(localStorage.getItem('token')) {
    userToken = jwt(localStorage.getItem('token'))
    username = userToken.user.username
  }

  if(state != null) { event = state }

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
    <div className="details">
      <div className="topnav">
        <a className="icon" onClick={navbar}><i className="fa fa-bars"></i></a>
        <Link to="/profile" className="userdisplay">{username}</Link>
        <div id="navLinks">
          <Link to="/">Main</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/logout">Logout</Link>
        </div>
      </div>
      <h2>Details</h2>
      {event && (
        <>
          <span className="detailsInfoBlock"><label>Event name:</label><span className="detailsInfo">{event.name}</span></span>
          <span className="detailsInfoBlock"><label>Hall number:</label><span className="detailsInfo">{event.hallnumber}</span></span>
          <span className="detailsInfoBlock"><label>Meeting type:</label><span className="detailsInfo">{event.type}</span></span>
          <span className="detailsInfoBlock"><label>Date:</label><span className="detailsInfo">{new Date(event.date).toISOString().replace('-', '/').split('T')[0].replace('-', '/')}</span></span>
          <label className="appointLabel">Comments:</label>
          <textarea className="commentsInput" value={event.comments} rows="4" cols="50" maxLength="145" readonly />
        </>
      )}
      <Link to="/">Go back.</Link>
    </div>
  )
}