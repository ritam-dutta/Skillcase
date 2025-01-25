import React, { useEffect, useState } from "react";
import Header from "./components/header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface EditProject {}
const EditProject: React.FC<EditProject> = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [industries, setIndustries] = useState([]);
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const [project, setProject] = useState<any>();
  const projectId = localStorage.getItem("projectId");
    useEffect(() => {
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
        const fetchProjectData = async	() => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                
                console.log("at",accessToken)
                const response = await axios.get(`http://localhost:8000/api/v1/root/currentproject`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        projectId: projectId,
                    },
                }
            );
                const projectData = response.data.data;
                // console.log("Project Data:", projectData);
                setProject(projectData);
                setProjectTitle(projectData?.title || "");
                setDescription(projectData?.description || "");
                setIndustry(projectData?.industry || "");
                setBudget(projectData?.budget || "");
                setDuration(projectData?.duration || "");
                setStatus(projectData?.status || "");
            } catch (error) {
                console.error("Fetch Project Data Error:", error);
            }
        }

        fetchProjectData();
    }, []);
        
    const handleEditProject = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/root/updateproject/`, {
                title: projectTitle || project.title ,
                description: description || project.description,
                industry: industry || project.industry,
                budget: budget || project.budget,
                duration: duration ||  project.duration,
                status: status || project.status,
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            // const projectData = response.data;
            // console.log("Upload Project Successful:", projectData);
            navigate(`/client/profile/${username}`);
        } catch (error) {
            console.error("Edit Project failed:", error);
            
        }
    }
    
  return (
    <>
    <body className="bg-gradient-to-r from-blue-50 to-blue-100">
    <Header />
      <div className="flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8 mt-8">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Edit Project</h1>
        <form className="space-y-6">
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
              className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
              className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 h-28 resize-none"
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
                className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 z-10 relative"
                required
            >
                <option value="">{ industry ? industry : "Select an industry"}</option>
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
            className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
              className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
                >
                <option value="">{status ? status : "Select a status"}</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                </select>
            </div>

          <div>
            <button
              type="button"
              onClick={handleEditProject}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
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

export default EditProject;
