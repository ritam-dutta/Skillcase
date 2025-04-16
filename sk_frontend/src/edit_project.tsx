import React, { useEffect, useState } from "react";
import Header from "./components/header";
import { Skeleton } from "./components/ui/skeleton";
// import Loader from "./components/loader";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface EditProject {}
interface Industry {
  id: string;
  label: string;
}
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
  const {projectid} = useParams<{ projectid: string}>();
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const url = window.location.href;
  let role = url.includes("freelancer") ? "freelancer" : "client";
    useEffect(() => {

        const fetchUserData = async () => {
          setLoading(true);
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
            setLoading(false);
        };
        fetchUserData();

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

        const fetchProjectData = async	() => {
          setLoading(true);
          // console.log("projectid",projectid)
            try {
                // const accessToken = localStorage.getItem("accessToken");
                
                // console.log("at",accessToken)
                const response = await axios.get(`http://localhost:8000/api/v1/root/currentproject`,
                {
                    headers: {
                        projectId: projectid,
                    },
                }
            );
                const projectData = response.data.data;
                console.log("Project Data:", projectData);
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
          setTimeout(() => setLoading(false), 200);          
        

    }, []);
        
    const handleEditProject = async () => {
        try {
            await axios.post(`http://localhost:8000/api/v1/root/updateproject/`, {
                title: projectTitle || project.title ,
                description: description || project.description,
                industry: industry || project.industry,
                budget: budget || project.budget,
                duration: duration ||  project.duration,
                status: status || project.status,
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    projectId: projectid,
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
    <body className="h-full w-full bg-gray-200 dark:bg-gray-600">
    <Header />

    <div className="h-[13vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-800 dark:to-slate-900 flex items-start px-4 sm:px-6 md:px-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-white dark:text-gray-100 font-bold mt-6">
        Edit Project
        </h1>
    </div>

  <div className="flex items-center justify-center lg:mt-[-14vh] px-4 sm:px-6">
    {!loading ? (
      <div className="w-full max-w-3xl bg-slate-50 dark:bg-slate-900 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mt-8 overflow-auto h-auto max-h-[88vh]">
        <form className="space-y-6">
          {/* Project Title */}
          <div>
            <p className="block text-sm font-medium text-blue-700">Project Title</p>
            <input
              type="text"
              id="projectName"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Enter your project name"
              className="mt-1 block w-full bg-slate-100 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-200 border-blue-300 border-[1px] outline-none rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          {/* Project Description */}
          <div>
            <p className="block text-sm font-medium text-blue-700">Description</p>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the project"
              className="mt-1 block w-full bg-slate-100 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-200 border-blue-300 border-[1px] outline-none rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 h-28 resize-none"
              required
            />
          </div>

          {/* Industry Select */}
          <div className="relative">
            <p className="block text-sm font-medium text-blue-700">Industry</p>
            <select
              id="Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1 block w-full bg-slate-100 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-200 border-blue-300 border-[1px] outline-none rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 z-10 relative"
              required
            >
              <option value="">{industry ? industry : "Select an industry"}</option>
              {industries.map((industry : Industry) => (
                <option key={industry.id} value={industry.label}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Input */}
          <div>
            <p className="block text-sm font-medium text-blue-700">Duration</p>
            <input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter the duration"
              className="mt-1 block w-full bg-slate-100 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-200 border-blue-300 border-[1px] outline-none rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          {/* Budget Input */}
          <div>
            <p className="block text-sm font-medium text-blue-700">Budget</p>
            <input
              type="text"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter your budget"
              className="mt-1 block w-full bg-slate-100 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-200 border-blue-300 border-[1px] outline-none rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          {/* Status Select */}
          <div>
            <p className="block text-sm font-medium text-blue-700">Status</p>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full bg-slate-100 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-200 border-blue-300 border-[1px] outline-none rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            >
              <option value="">{status ? status : "Select a status"}</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              type="button"
              onClick={() => window.confirm("Are you sure to discard the changes?") && navigate(`/client/profile/${username}`)}
              className="w-full sm:w-auto bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Cancel Changes
            </button>
            <button
              type="button"
              onClick={() => window.confirm("Are you sure to save the changes?") && handleEditProject()}
              className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition focus:outline-none"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    ) : (
      <div className="w-full max-w-3xl bg-slate-50 dark:bg-slate-800 rounded-lg shadow-lg h-[77vh] mt-8 flex flex-col gap-3 p-4 sm:p-6 md:p-8">
        <Skeleton className="w-4/5 h-16 dark:bg-slate-700" />
        <Skeleton className="w-3/5 h-12 dark:bg-slate-700" />
        <Skeleton className="w-2/5 h-8 dark:bg-slate-700" />
        <Skeleton className="w-5/6 h-20 dark:bg-slate-700" />
        <Skeleton className="w-full h-14 dark:bg-slate-700" />
        <Skeleton className="w-4/6 h-10 dark:bg-slate-700" />
        <Skeleton className="w-4/6 h-14 dark:bg-slate-700" />
        <Skeleton className="w-1/3 h-14 dark:bg-slate-700" />
      </div>
    )}
  </div>
</body>


    </>
  );
};

export default EditProject;
