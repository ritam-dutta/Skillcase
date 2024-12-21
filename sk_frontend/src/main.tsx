import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './login.tsx'
import {Route,RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Client_reg from './client_register.tsx'
import Freelancer_reg from './freelancer_register.tsx'
import Connector from './connector.tsx'
import Not_found from './components/not_found.tsx'
import Profile from './profile.tsx'
import Edit from './components/edit_profile.tsx'




const router= createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" >
      <Route path='freelancer/login' element={<Login/>}> </Route>
      <Route path='client/login' element={<Login/>}> </Route>
      <Route path='client/register' element={<Client_reg/>}> </Route>
      <Route path='freelancer/register' element={<Freelancer_reg/>}> </Route>
      <Route path='' element={<Connector/>}> </Route>
      <Route path='freelancer/:username' element={<Profile/>}> </Route>
      <Route path='client/:username' element={<Profile/>}> </Route>
      <Route path='freelancer/:username/edit' element={<Edit/>}> </Route>
      <Route path='client/:username/edit' element={<Edit/>}> </Route>
      <Route path="*" element={<Not_found/>}></Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
