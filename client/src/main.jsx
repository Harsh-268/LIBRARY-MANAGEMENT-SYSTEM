import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter,createRoutesFromElements,RouterProvider,Route} from 'react-router-dom'
import Getbooks from './pages/books/Getbooks.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import { AuthProvider } from './context/AuthContext.jsx'



const router= createBrowserRouter(
  createRoutesFromElements(
    <Route >


       {/* Paths with standard Header and footer */}
      <Route path='/' element={<Layout/>}>
      <Route path='Home' element={<Home/>}/>
      <Route path='get-books' element={<Getbooks/>}/>
      </Route>


      {/* Paths without Header and Footer */}
      <Route path='login' element={<Login/>}/>
      <Route path='register' element={<Register/>}/>

      {/* Different layout for users */}
      {/* <Route path='user' element={<UserLayout/>}>
        <Route path='profile' element={<Profile/>}/>
      </Route> */}

    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
