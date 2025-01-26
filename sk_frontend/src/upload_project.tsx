import React, { useEffect, useState } from "react";
import Header from "./components/header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface UploadProject {}
const UploadProject: React.FC<UploadProject> = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [industry, setIndustry] = useState("");
  const [industries, setIndustries] = useState([]);
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const url = window.location.href;
  const role = url.includes("freelancer") ? "freelancer" : "client";
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {

    const fetchUserData = async () => {
      try {
          const responseLoggedUser = await axios.get(`http://localhost:8000/api/v1/${role}/loggedIn${role[0].toUpperCase()}${role.slice(1)}`, {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          });

          const responseCurrentUser = await axios.get(`http://localhost:8000/api/v1/${role}/profile/${username}`, {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          });

          let currentUser;
          let loggedInUser;
          let fetchedUser;
          if (role === "freelancer") {
              currentUser = responseCurrentUser.data?.data?.freelancer;
              loggedInUser = responseLoggedUser.data?.data?.freelancer;
          } else if (role === "client") {
              currentUser = responseCurrentUser.data?.data?.client;
              loggedInUser = responseLoggedUser.data?.data?.client;
          }
          console.log(currentUser, loggedInUser);

          if (loggedInUser.username === currentUser.username) {
              fetchedUser = loggedInUser;
          } else {
              navigate(`/${role}/profile/${username}`);
          }

          if (!fetchedUser) {
              navigate(`/${role}/profile/${username}`);
          }

      } catch (error) {
          console.error("Error fetching user data", error);
          navigate(`/${role}/profile/${username}`);
      }
    };
  fetchUserData();

    const fetchIndustries = async () => {
      try {
        const response = await axios.get("https://api.smartrecruiters.com/v1/industries");
        setIndustries(response.data.content);
        // console.log("Industries:", response.data);
      } catch (error) {
        console.error("Fetch Industries Error:", error);
      }
    };
    fetchIndustries();
    }, []);
        
    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/v1/root/uploadproject", {
                title: projectTitle,
                description: description,
                industry: industry,
                budget: budget,
                duration: duration,
                status: status,
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            const projectData = response.data;
            console.log("Upload Project Successful:", projectData);
            navigate(`/client/projects/${username}`);
        } catch (error) {
            console.error("Upload Project Error:", error);
            
        }
    }


  return (
    <>
    <body className="bg-[url('/images/background.jpg')] bg-cover bg-center">
    <Header />
    <div className="h-[15vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-start px-8">
        <h1 className="text-3xl text-white font-bold mt-6">Upload Project</h1>
      </div>
      <div className="flex items-center justify-center">
      <div className="w-full h-[76.3vh] max-w-3xl bg-slate-200 rounded-lg shadow-lg p-8 mt-[-11vh] overflow-auto">
        {/* <h1 className="text-2xl font-bold text-blue-700 mb-6">Upload Project</h1> */}
        <form onSubmit={handleSubmit} className="space-y-6 ">
          <div>
            <p className="block text-sm font-medium text-blue-700">
              Project Title
            </p>
            <input
              type="text"
              id="projectName"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Enter your project name"
              className="mt-1 block w-full bg-slate-100 border border-blue-300 rounded-md shadow-sm py-2 px-3 outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          <div>
            <p className="block text-sm font-medium text-blue-700">
              Description
            </p>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the project"
              className="mt-1 block w-full bg-slate-100 border border-blue-300 rounded-md shadow-sm py-2 px-3 outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 h-28 resize-none"
              required
            />
          </div>

           <div className="relative">
            <p className="block text-sm font-medium text-blue-700">
                Industry
            </p>
            <select
                id="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="mt-1 block w-full bg-slate-100 border border-blue-300 rounded-md shadow-sm py-2 px-3 outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 z-10 relative"
                required
            >
                <option value="">Select an industry</option>
                {industries.map((industry) => (
                <option key={industry.id} value={industry.label}>
                    {industry.label}
                </option>
                ))}
            </select>
        </div>

          {/* <div>
            <p className="block text-sm font-medium text-blue-700">
              Category
            </p>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            >
              <option value="">Select a category</option>
              <option value="web-development">Web Development</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="data-science">Data Science</option>
            </select>
          </div> */}

        <div>
            <p className="block text-sm font-medium text-blue-700">
            Duration
            </p>
            <input
            type="text"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter the duration"
            className="mt-1 block w-full bg-slate-100 border border-blue-300 rounded-md shadow-sm py-2 px-3 outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            required
            />
        </div>

        <div>
            <p className="block text-sm font-medium text-blue-700">
                Budget
            </p>
            <input
              type="text"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter your budget"
              className="mt-1 block w-full bg-slate-100 border border-blue-300 rounded-md shadow-sm py-2 px-3 outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

            <div>
                <p className="block text-sm font-medium text-blue-700">
                Status
                </p>
                <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full bg-slate-100 border border-blue-300 rounded-md shadow-sm py-2 px-3 outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 "
                required
                >
                <option value="">Select a status</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                </select>
            </div>

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Float Project
            </button>
          </div>
        </form>
      </div>
      
    </div>
    
    <footer className="w-full h-[8vh] mt-7 flex justify-center items-center bg-[#1e3a8a] text-white">
        <p className="text-sm">&copy; 2025 Skillcase. All rights reserved.</p>
    </footer>

    </body>
    </>
  );
};

export default UploadProject;
