import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Calendar from 'react-calendar'
import jwt from 'jwt-decode'
import Login from './Login'
import 'react-calendar/dist/Calendar.css';

function navbar() {
  var x = document.getElementById("navLinks");
  console.log(x)
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

var events = []

async function getEvent(date) {
  try {
    await fetch('http://localhost:3001/php/api/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: date.toISOString().slice(0, 19).replace('T', ' ')
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
          events[data.status.date] = data.status
        }
      })
  } catch (error) {
    console.log(error.message)
  }
}

var today = new Date()
var startDate = new Date(today.setHours(0, 0, 0))
var endOfCheck = new Date(today.setMonth(today.getMonth() + 1)).getTime()

for(let start = startDate; new Date(start).getTime() < new Date(endOfCheck).getTime(); start = new Date(start.setDate(start.getDate() + 1))) {
  getEvent(start)
}

var formated_date = ""

export default function Main() {
  const [dateValue, onChange] = useState(new Date());

  var userToken = undefined
  var username = ""

  if(localStorage.getItem('token')) {
    userToken = jwt(localStorage.getItem('token'))
    username = userToken.user.username
  }

  function tileContent({ date, view }) {
    if (view === 'month') {
      formated_date = date.toISOString().slice(0, 19).replace('T', ' ')
      if (events[formated_date]) {
        return(<Link className="scheduled" to="/details" state={events[formated_date]}>✓</Link>)
      }
    }
  }

  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
        {userToken ? (
          <div className="main">
            <div className="topnav">
              <a className="icon" onClick={navbar}><i className="fa fa-bars"></i></a>
              <Link to="/profile" className="userdisplay">{username}</Link>
              <div id="navLinks">
                <Link to="/">Main</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/logout">Logout</Link>
              </div>
            </div>
            <h1>Schedule</h1>
            <Calendar onChange={onChange} tileContent={tileContent} minDate={new Date()} />
            <span className="dateDisplay">Selected date: {dateValue.toLocaleDateString()}</span>
            <Link to="/appoint" state={dateValue}><button className="appointButton">Appoint<img className="checkmark" src={require('../images/Checkmark.png')} /></button></Link>
          </div>
        ) : (
          <Login />
        )}
    </div>
  )
}