import { useState } from 'react'
import Login from './pages/Login'
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Register from './pages/Register'
import Getbooks from './pages/books/Getbooks'
import Home from './pages/user/Home'

function App() {

  return (
    <>
     <Router>
      {/* <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/all-books' element={<Getbooks/>}/>
      </Routes> */}
     </Router>
      
    </>
  )
}

export default App
