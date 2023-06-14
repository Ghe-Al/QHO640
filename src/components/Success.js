import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}

export default function Logout() {
  const navigate = useNavigate()
  useEffect(() => {
    setTimeout(function(){
      navigate('/')
    }, 2000);
  },[true])

  return (
    <div className="success">
      <h1>Completed !</h1>
      <img src={require('../images/Thumbs.png')} />
    </div>
  )
}