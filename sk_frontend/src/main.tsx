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
import EditClient from './edit_profile_client.tsx'
import EditFreelancer from './edit_profile_freelancer.tsx'
import ProjectPage from './projects.tsx'
import HomePage from './home.tsx'
import UploadProject from './upload_project.tsx'
import EditProject from './edit_project.tsx'
import ViewProjects from './view_all_projects.tsx'
import ViewProject from './view_project.tsx'
import ViewFeedProject from './view_feed_project.tsx'
import Followers from './followers.tsx'



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
      <Route path='freelancer/edit/:username' element={<EditFreelancer/>}> </Route>
      <Route path='client/edit/:username' element={<EditClient/>}> </Route>
      <Route path='client/projects/:username' element={<ProjectPage/>}> </Route>
      <Route path='freelancer/projects/:username' element={<ProjectPage/>}> </Route>
      <Route path='projects' element={<ProjectPage/>}> </Route>
      <Route path='client/upload_project/:username' element={<UploadProject/>}> </Route>
      <Route path='client/edit_project/:username/:projectid' element={<EditProject/>}> </Route>
      <Route path='client/view_projects/:username' element={<ViewProjects/>}> </Route>
      <Route path='client/view_project/:projectid' element={<ViewProject/>}> </Route>
      <Route path='freelancer/view_project/:projectid' element={<ViewProject/>}> </Route>
      <Route path='client/view_feed_project/:projectid' element={<ViewFeedProject/>}> </Route>
      <Route path='freelancer/view_feed_project/:projectid' element={<ViewFeedProject/>}> </Route>
      <Route path='freelancer/followers/:username' element={<Followers/>}> </Route>
      <Route path='client/followers/:username' element={<Followers/>}> </Route>
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
