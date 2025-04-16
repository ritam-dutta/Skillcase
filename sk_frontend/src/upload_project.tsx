import React, { useEffect, useState } from "react";
import Header from "./components/header";
import { Skeleton } from "./components/ui/skeleton";
// import Loader from "./components/loader";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface UploadProject {}
interface Industry {
    id: string;
    label: string;
}
const UploadProject: React.FC<UploadProject> = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [industries, setIndustries] = useState([]);
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const loggedUsername = localStorage.getItem("username") || "";
  const [loading, setLoading] = useState(false);
  const url = window.location.href;
  const role = url.includes("freelancer") ? "freelancer" : "client";
  // const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    loggedUsername !== username && navigate(`/${role}/profile/${username}`);
    const fetchIndustries = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://api.smartrecruiters.com/v1/industries");
        setIndustries(response.data.content);
        // console.log("Industries:", response.data);
      } catch (error) {
        console.error("Fetch Industries Error:", error);
      }
      setLoading(false);
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
            navigate(`/client/profile/${username}`);
        } catch (error) {
            alert(`an error occured, project could not be floated: ${error}`)
            console.error("Upload Project Error:", error);
            
        }
    }


  return (
    <>
    <body className="bg-gray-300 dark:bg-gray-600 min-h-screen flex flex-col">
  <Header />
  
  {/* Header Section */}
  <div className="h-[15vh] w-full flex items-start px-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-800 dark:to-slate-900">
    <h1 className="text-3xl text-white dark:text-gray-100 font-bold mt-6">Upload Project</h1>
  </div>

  {/* Main Content */}
  <div className="flex items-center justify-center flex-grow px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-3xl bg-slate-100 dark:bg-slate-900 rounded-lg shadow-lg p-6 sm:p-8 lg:mt-[-11vh] mt-0 overflow-auto">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Project Title */}
        <div>
          <p className="block text-sm font-medium text-blue-700 dark:text-blue-400">Project Title</p>
          <input
            type="text"
            id="projectName"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Enter your project name"
            className="mt-1 block w-full bg-slate-200 dark:bg-slate-700 border border-blue-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Description */}
        <div>
          <p className="block text-sm font-medium text-blue-700 dark:text-blue-400">Description</p>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a detailed description of the project"
            className="mt-1 block w-full bg-slate-200 dark:bg-slate-700 border border-blue-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white h-28 resize-none"
            required
          />
        </div>

        {/* Industry */}
        {!loading ? (
          <div className="relative">
            <p className="block text-sm font-medium text-blue-700 dark:text-blue-400">Industry</p>
            <select
              id="Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1 block w-full bg-slate-200 dark:bg-slate-700 border border-blue-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select an industry</option>
              {industries.map((industry: Industry) => (
                <option key={industry.id} value={industry.label}>{industry.label}</option>
              ))}
            </select>
          </div>
        ) : (
          <Skeleton className="w-full h-10" />
        )}

        {/* Duration */}
        <div>
          <p className="block text-sm font-medium text-blue-700 dark:text-blue-400">Duration</p>
          <input
            type="text"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter the duration"
            className="mt-1 block w-full bg-slate-200 dark:bg-slate-700 border border-blue-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Budget */}
        <div>
          <p className="block text-sm font-medium text-blue-700 dark:text-blue-400">Budget</p>
          <input
            type="text"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter your budget"
            className="mt-1 block w-full bg-slate-200 dark:bg-slate-700 border border-blue-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Status */}
        <div>
          <p className="block text-sm font-medium text-blue-700 dark:text-blue-400">Status</p>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full bg-slate-200 dark:bg-slate-700 border border-blue-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
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

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Float Project
          </button>
        </div>
      </form>
    </div>
  </div>
</body>


    </>
  );
};

export default UploadProject;
