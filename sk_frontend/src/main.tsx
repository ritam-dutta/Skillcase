import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './login.tsx'
import {Route,RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Client_reg from './client_register.tsx'
import Freelancer_reg from './freelancer_register.tsx'
import Connector from './connector.tsx'
import Not_found from './components/not_found.tsx'
import FreelancerProfile from './profile_freelancer.tsx'
import ClientProfile from './profile_client.tsx'
import Edit from './components/edit_profile.tsx'
import ProjectPage from './projects.tsx'
import HomePage from './home.tsx'
import UploadProject from './upload_project.tsx'
import EditProject from './edit_project.tsx'
import { Edit2 } from 'lucide-react'




const router= createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" >
      <Route path='freelancer/login' element={<Login/>}> </Route>
      <Route path='client/login' element={<Login/>}> </Route>
      <Route path='client/register' element={<Client_reg/>}> </Route>
      <Route path='freelancer/register' element={<Freelancer_reg/>}> </Route>
      <Route path='connector' element={<Connector/>}> </Route>
      <Route path='freelancer/profile/:username' element={<FreelancerProfile/>}> </Route>
      <Route path='client/profile/:username' element={<ClientProfile/>}> </Route>
      <Route path='freelancer/edit/:username' element={<Edit/>}> </Route>
      <Route path='client/edit/:username' element={<Edit/>}> </Route>
      <Route path='client/projects/:username' element={<ProjectPage/>}> </Route>
      <Route path='freelancer/projects/:username' element={<ProjectPage/>}> </Route>
      <Route path='client/upload_project/:username' element={<UploadProject/>}> </Route>
      <Route path='client/edit_project/:username' element={<EditProject/>}> </Route>
      <Route path='' element={<HomePage/>}> </Route>
      <Route path="*" element={<Not_found/>}></Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
