import { Route, Routes, Link } from 'react-router-dom'
import Main from './components/Main'
import Login from './components/Login'
import Logout from './components/Logout'
import Profile from './components/Profile'
import Register from './components/Register'
import Appoint from './components/Appoint'
import Success from './components/Success'
import Details from './components/Details'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/appoint" element={<Appoint />} />
        <Route path="/details" element={<Details />} />
      </Routes>
    </div>
  );
}

export default App;