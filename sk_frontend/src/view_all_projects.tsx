import React,{ useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { Link } from "react-router-dom";
import Header from "./components/header";
import Loader from "./components/loader";
import axios from "axios";
import { Zap } from "lucide-react";
import "./App.css"
import { useNotification } from "./context/notifications.context";
interface ViewProjects {}
interface Project {
    title: string;
    description: string;
    budget: string;
    duration: string;
    industry: string;
    employer: string;
    status: string;
    _id: string;
}
const ViewProjects : React.FC<ViewProjects> = ({})=>{
    const [user, setUser] = useState<any>();
    const [projects, setProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [inProgressProjects, setInProgressProjects] = useState([]);
    const [notStartedProjects, setNotStartedProjects] = useState([]);
    const [onHoldProjects, setOnHoldProjects] = useState([]);
    const [cancelledProjects, setCancelledProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const {requests} = useNotification();

    const url = window.location.href;
    let userType="";
    if(url.includes("freelancer")){
        userType="freelancer"
    }
    else if(url.includes("client")){
        userType="client"
    }

    const[currentRole,setRole]=useState(userType);
    const {username} = useParams<{ username: string }>();
    const [loggedUsername, setLoggedUsername] = useState("");
    

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const loggedInRole = localStorage.getItem("role") || "";
        // console.log("fetched token",accessToken)
        if (!accessToken) {
            navigate(`/${currentRole}/login`);
        } 

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const responseLoggedUser = await axios.get(`http://localhost:8000/api/v1/${loggedInRole}/loggedIn${loggedInRole[0].toUpperCase()}${loggedInRole.slice(1)}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const responseCurrentUser = await axios.get(`http://localhost:8000/api/v1/${currentRole}/profile/${username}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                let currentUser ;
                let loggedInUser;
                let fetchedUser;
                if(currentRole===loggedInRole){
                    if(currentRole==="freelancer"){
                        currentUser = responseCurrentUser.data?.data?.freelancer;
                        loggedInUser = responseLoggedUser.data?.data?.freelancer;
                    }
                    else if(currentRole==="client"){
                        currentUser = responseCurrentUser.data?.data?.client;
                        loggedInUser = responseLoggedUser.data?.data?.client;
                    } 
                }
                else{
                    if(currentRole==="freelancer"){
                        currentUser = responseCurrentUser.data?.data?.freelancer;
                        loggedInUser = responseLoggedUser.data?.data?.client;
                    }
                    else if(currentRole==="client"){
                        currentUser = responseCurrentUser.data?.data?.client;
                        loggedInUser = responseLoggedUser.data?.data?.freelancer;
                    }
                }  
                if(loggedInUser.username === currentUser.username){
                    fetchedUser = loggedInUser;
                    setLoggedUsername(loggedInUser.username);   
                }
                else{
                    fetchedUser = currentUser;
                    setLoggedUsername(loggedInUser.username);
                }
              
                setUser(fetchedUser);
                setRole(fetchedUser?.role || "")
            } catch (error) {
                console.error("error fetching user data",error);
                navigate(`/${currentRole}/login`);
            } finally{
                setLoading(false);
            }
        };
        fetchUserData();
        const fetchUserProjects = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8000/api/v1/root/getuserprojects",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        username: username,
                    },
                });
        
                const projects = response.data.data;
                setProjects(projects);
                let compProjects = projects.filter((project : Project) => project.status === "Completed");
                let inprogProjects = projects.filter((project : Project) => project.status === "In Progress");
                let notStartProjects = projects.filter((project : Project) => project.status === "Not Started");
                let holdProjects = projects.filter((project : Project) => project.status === "On Hold");
                let cancelProjects = projects.filter((project : Project) => project.status === "Cancelled");
                setCompletedProjects(compProjects);
                setInProgressProjects(inprogProjects);
                setNotStartedProjects(notStartProjects);
                setOnHoldProjects(holdProjects);
                setCancelledProjects(cancelProjects);
            } catch (error) {
                console.error("Fetch Projects Error:", error);
            } finally{
                setLoading(false);
            }
        };

        fetchUserProjects();
    }, [navigate]);

    let notStarted=0;
    let inProgress=0;
    let onHold=0;
    let completed=0;
    let cancelled=0;
    let total=projects.length;
    projects.map((project : Project)=>{
        if(project.status==="Not Started"){
            notStarted++;
        }
        else if(project.status==="In Progress"){
            inProgress++;
        }
        else if(project.status==="On Hold"){
            onHold++;
        }
        else if(project.status==="Completed"){
            completed++;
        }
        else if(project.status==="Cancelled"){
            cancelled++;
        }
    })

  return(
    <>
        
        <div className="min-h-screen w-full bg-[url('/images/background.jpg')] bg-cover bg-center">
      <Header/>
      {/* <header className="h-[8vh] w-full bg-gradient-to-r from-gray-50 to-gray-200 text-white shadow-md">
      <div className="container mx-auto h-full px-6 flex justify-between items-center">
        <div className="flex items-center">

          <Link to="/" className="text-2xl font-bold text-gray-600">
            SkillCase
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6">
          
        </nav>

        <div className=" flex items-center">
          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </header> */}
        {/* Main Content Area */}
      <div className="h-[18vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-start px-8">
        <h1 className="text-3xl text-white font-bold mt-6">All Projects</h1>
      </div>

      <div className="flex flex-row justify-center mt-[-10vh]">
        
        {!loading ? (
        <div className="w-[65%] h-[83vh] bg-slate-50 shadow-lg rounded-lg p-8 ml-6 border border-gray-200 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Projects Status</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">Completed: {completed}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">Not Started: {notStarted}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">In Progress: {inProgress}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">On Hold: {onHold}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">Cancelled: {cancelled}</h3>
            </div>
            <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-4/5 flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-700">Total: {total}</h3>
            </div>
          </div>

            {/*completed projects*/}

          <h2 className="text-xl font-semibold mb-3 text-black">Completed Projects</h2>
        <div className="mb-8 overflow-auto bg-gray-200 px-4 py-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedProjects.length > 0 ? (
                completedProjects.map((project : Project) => (
                    <div
                        key={project._id}
                        className="bg-slate-50 border border-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition"
                    >
                        <div className="w-full flex justify-between items-end">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 truncate">
                                    {project.description || "No description provided."}
                                </p>
                            </div>
                            <div>
                                <button
                                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition mr-1"
                                    onClick={() => navigate(`/client/view_project/${username}/${project._id}`)}
                                    >
                                    View Project
                                </button>
                            </div>
                        </div>
                        {/* <p className="text-sm text-gray-600 mt-1 truncate">
                            {project.status || "No status provided."}
                        </p> */}
                        {username === loggedUsername ? (    
                            <div className="mt-4 flex items-center justify-between gap-4">
                                <span className="text-sm text-blue-500 font-medium">
                                {project.industry || "Uncategorized"}
                                </span>
                                <button
                                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition w-2/4"
                                onClick={() => navigate(`/client/edit_project/${username}/${project._id}`)}
                                >
                                Edit Project
                                </button>
                            </div>)
                            :null
                        }
                    </div>
                ))
                ) : (
                <div className="col-span-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">No completed projects available</p>
                </div>
                )}
            </div>
        </div>

         {/*Not started projects*/}

         <h2 className="text-xl font-semibold mb-3 text-black">Not Started Projects</h2>
        <div className="mb-8 overflow-auto bg-gray-200 px-4 py-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {notStartedProjects.length > 0 ? (
                notStartedProjects.map((project : Project) => (
                    <div
                        key={project._id}
                        className="bg-slate-50 border border-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition"
                    >
                        <div className="w-full flex justify-between items-end">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 truncate">
                                    {project.description || "No description provided."}
                                </p>
                            </div>
                            <div>
                                <button
                                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition mr-1"
                                    onClick={() => navigate(`/client/view_project/${username}/${project._id}`)}
                                    >
                                    View Project
                                </button>
                            </div>
                        </div>
                        {/* <p className="text-sm text-gray-600 mt-1 truncate">
                            {project.status || "No status provided."}
                        </p> */}
                        {username === loggedUsername ? (    
                            <div className="mt-4 flex items-center justify-between gap-4">
                                <span className="text-sm text-blue-500 font-medium">
                                {project.industry || "Uncategorized"}
                                </span>
                                <button
                                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition w-2/4"
                                onClick={() => navigate(`/client/edit_project/${username}/${project._id}`)}
                                >
                                Edit Project
                                </button>
                            </div>)
                            :null
                        }
                    </div>
                ))
                ) : (
                <div className="col-span-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">No Data available</p>
                </div>
                )}
            </div>
        </div>

         {/*In progress projects*/}

         <h2 className="text-xl font-semibold mb-3 text-black"> Projects In Progress</h2>
        <div className="mb-8 overflow-auto bg-gray-200 px-4 py-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressProjects.length > 0 ? (
                inProgressProjects.map((project : Project) => (
                    <div
                        key={project._id}
                        className="bg-slate-50 border border-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition">
                        <div className="w-full flex justify-between items-end">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 truncate">
                                    {project.description || "No description provided."}
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex justify-end items-center mb-3">
                                    {requests.filter((request:any)=>request.projectId===project._id).length>0 ? (
                                <button
                                    className="flex justify-center items-center bg-red-500 text-white h-5 w-5 rounded-full hover:text-white hover:bg-red-400 transition"
                                    onClick={() => navigate(`/client/requests/${username}/${project._id}`)}
                                >
                                    <Zap size={16} />
                                </button>) 
                                : null
                                }
                                </div>

                                <button
                                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition min-w-[120px]"
                                    onClick={() => navigate(`/client/view_project/${username}/${project._id}`)}
                                >
                                    View Project
                                </button>
                            </div>
                        </div>
                        
                        {username === loggedUsername ? (    
                            <div className="mt-4 flex items-center justify-between gap-4">
                                <span className="text-sm text-blue-500 font-medium">
                                {project.industry || "Uncategorized"}
                                </span>
                                <button
                                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition w-2/4"
                                onClick={() => navigate(`/client/edit_project/${username}/${project._id}`)}
                                >
                                Edit Project
                                </button>
                            </div>)
                            
                            :null
                        }
                    </div>
                ))
                ) : (
                <div className="col-span-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">No completed projects available</p>
                </div>
                )}
            </div>
        </div>

         {/*On hold projects*/}

         <h2 className="text-xl font-semibold mb-3 text-black">Projects On Hold</h2>
        <div className="mb-8 overflow-auto bg-gray-200 px-4 py-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {onHoldProjects.length > 0 ? (
                onHoldProjects.map((project : Project) => (
                    <div
                        key={project._id}
                        className="bg-slate-50 border border-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition"
                    >
                        <div className="w-full flex justify-between items-end">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 truncate">
                                    {project.description || "No description provided."}
                                </p>
                            </div>
                            <div>
                                <button
                                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition mr-1"
                                    onClick={() => navigate(`/client/view_project/${username}/${project._id}`)}
                                    >
                                    View Project
                                </button>
                            </div>
                        </div>
                        {/* <p className="text-sm text-gray-600 mt-1 truncate">
                            {project.status || "No status provided."}
                        </p> */}
                        {username === loggedUsername ? (    
                            <div className="mt-4 flex items-center justify-between gap-4">
                                <span className="text-sm text-blue-500 font-medium">
                                {project.industry || "Uncategorized"}
                                </span>
                                <button
                                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition w-2/4"
                                onClick={() => navigate(`/client/edit_project/${username}/${project._id}`)}
                                >
                                Edit Project
                                </button>
                            </div>)
                            :null
                        }
                    </div>
                ))
                ) : (
                <div className="col-span-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">No completed projects available</p>
                </div>
                )}
            </div>
        </div>

          {/* Cancelled Projects */}
          <h2 className="text-xl font-semibold mb-3 text-black"> Cancelled Progress</h2>
        <div className="mb-8 overflow-auto bg-gray-200 px-4 py-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledProjects.length > 0 ? (
                cancelledProjects.map((project : Project) => (
                    <div
                        key={project._id}
                        className="bg-slate-50 border border-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition"
                    >
                        <div className="w-full flex justify-between items-end">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 truncate">
                                    {project.description || "No description provided."}
                                </p>
                            </div>
                            <div>
                                <button
                                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition mr-1"
                                    onClick={() => navigate(`/client/view_project/${username}/${project._id}`)}
                                    >
                                    View Project
                                </button>
                            </div>
                        </div>
                        {/* <p className="text-sm text-gray-600 mt-1 truncate">
                            {project.status || "No status provided."}
                        </p> */}
                        {username === loggedUsername ? (    
                            <div className="mt-4 flex items-center justify-between gap-4">
                                <span className="text-sm text-blue-500 font-medium">
                                {project.industry || "Uncategorized"}
                                </span>
                                <button
                                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition w-2/4"
                                onClick={() => navigate(`/client/edit_project/${username}/${project._id}`)}
                                >
                                Edit Project
                                </button>
                            </div>)
                            :null
                        }
                    </div>
                ))
                ) : (
                <div className="col-span-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">No completed projects available</p>
                </div>
                )}
            </div>
        </div>          

            <div className="w-full flex justify-center items-center">
                <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => navigate(`/client/profile/${username}`)}
                    >
                    Go to Profile
                </button>
            </div>
      </div>)
      :(
        <div>
            <div className="h-[70vh] w-[50vw] flex justify-center items-center bg-slate-50 rounded-md shadow-lg">
                <Loader />
            </div>
        </div>
      )}
    {/* <Footer/> */}
    </div>
            
    </div>

    </>
  )
}
export default ViewProjects