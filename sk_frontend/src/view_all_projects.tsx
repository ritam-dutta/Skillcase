import React,{ useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { Link } from "react-router-dom";
import Header from "./components/header";
import { Skeleton } from "./components/ui/skeleton";
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
    requests: Array<any>;
}
const ViewProjects : React.FC<ViewProjects> = ({})=>{
    // const [user, setUser] = useState<any>();
    const [projects, setProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [inProgressProjects, setInProgressProjects] = useState([]);
    const [notStartedProjects, setNotStartedProjects] = useState([]);
    const [onHoldProjects, setOnHoldProjects] = useState([]);
    const [cancelledProjects, setCancelledProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const {requests} = useNotification();
    const [requestedProjects, setRequestedProjects] = useState<string[]>([]);
    // console.log("requests", requests);
    const loggedInRole = localStorage.getItem("role") || "";
    const loggedUsername = localStorage.getItem("username") || "";
    const accessToken = localStorage.getItem("accessToken");

    const url = window.location.href;
    let userType="";
    if(url.includes("freelancer")){
        userType="freelancer"
    }
    else if(url.includes("client")){
        userType="client"
    }

    // const[currentRole,setRole]=useState(userType);
    const {username} = useParams<{ username: string }>();
    // const [loggedUsername, setLoggedUsername] = useState("");
    

    const navigate = useNavigate();

    useEffect(() => {
        // console.log("fetched token",accessToken)
        setLoading(true);
        if (!accessToken) {
            navigate(`/${userType}/login`);
        } 
        const fetchUserProjects = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/root/getuserprojects",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        username: username,
                        role: userType,
                    },
                });
        
                const projects = response.data.data;
                setProjects(projects);
                let compProjects = projects.filter((project : Project) => project.status === "Completed");
                let inprogProjects = projects.filter((project : Project) => project.status === "In Progress");
                let requestedProjectsIds = inprogProjects.map((project : Project) => project.requests.length > 0 ? project._id : "").filter((id: string) => id !== "");
                let notStartProjects = projects.filter((project : Project) => project.status === "Not Started");
                let holdProjects = projects.filter((project : Project) => project.status === "On Hold");
                let cancelProjects = projects.filter((project : Project) => project.status === "Cancelled");
                setRequestedProjects(requestedProjectsIds);
                console.log("Projects:", requestedProjectsIds);
                setCompletedProjects(compProjects);
                setInProgressProjects(inprogProjects);
                setNotStartedProjects(notStartProjects);
                setOnHoldProjects(holdProjects);
                setCancelledProjects(cancelProjects);
            } catch (error) {
                console.error("Fetch Projects Error:", error);
            } 
        };
        
        fetchUserProjects();
        setTimeout(() => setLoading(false), 200);
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
        
    <div className="min-h-screen w-full bg-[url('/images/background.jpg')] bg-cover bg-center">
        <Header/>

        {/* Main Content Area */}

        <div className="lg:h-[18vh] sm:h-[10vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center px-8">
            <h1 className="text-3xl text-white font-bold">All Projects</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-center lg:mt-[-10vh] px-4 md:px-0">
        
            {!loading ? (
            <div className="w-full md:w-[65%] h-auto bg-slate-50 shadow-lg rounded-lg p-8 border border-gray-200 overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Projects Status</h2>

            {/* Stats Cards */}

            {loggedInRole === "client" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-full flex justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Completed: {completed}</h3>
                    </div>
                    <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-full flex justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-700">In Progress: {inProgress}</h3>
                    </div>
                    <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-full flex justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Not Started: {notStarted}</h3>
                    </div>
                    <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-full flex justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-700">On Hold: {onHold}</h3>
                    </div>
                    <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-full flex justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Cancelled: {cancelled}</h3>
                    </div>
                    <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-full flex justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Total: {total}</h3>
                    </div>
                </div>)
            :(
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-full flex justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Completed: {completed}</h3>
                    </div>
                    <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-full flex justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-700">In Progress: {inProgress}</h3>
                    </div>
                    <div className="bg-gray-200 p-4 shadow-sm border border-gray-200 rounded-lg w-full flex justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Total: {total}</h3>
                    </div>
            </div>
            )}


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
                                        {(project.description.length > 15 ? project.description.slice(0,15)+"..." : project.description) || "No description provided."}
                                    </p>
                                </div>
                                <div>
                                    <button
                                        className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition mr-1"
                                        onClick={() => navigate(`/${userType}/view_project/${username}/${project._id}`)}
                                        >
                                        View Project
                                    </button>
                                </div>
                            </div>
                        {/* <p className="text-sm text-gray-600 mt-1 truncate">
                            {project.status || "No status provided."}
                        </p> */}
                            {(username === loggedUsername && loggedInRole === "client") ? (    
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

                {userType==="client" ? (
                    <div>
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
                                                    {(project.description.length > 15 ? project.description.slice(0,15)+"..." : project.description) || "No description provided."}
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
                    </div>)
                    : null
                    }

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
                                    {(project.description.length > 5 ? project.description.slice(0,5)+"..." : project.description) || "No description provided."}
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex justify-end items-center mb-3">
                                    {(requests.filter((request:any)=>request.projectId===project._id).length > 0 && loggedUsername === username) ? (
                                <button
                                    className="flex justify-center items-center bg-red-500 text-white h-5 w-5 rounded-full hover:text-white hover:bg-red-400 transition"
                                    onClick={() => navigate(`/client/requests/${username}/${project._id}`)}
                                >
                                    <Zap size={16} />
                                </button>) 
                                : (requestedProjects.includes(project._id) && loggedUsername === username) ? (
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
                                    onClick={() => navigate(`/${userType}/view_project/${username}/${project._id}`)}
                                >
                                    View Project
                                </button>
                            </div>
                        </div>
                        
                        {(username === loggedUsername && loggedInRole === "client") ? (    
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

         {userType === "client"? (
        <div>
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
                                        {(project.description.length > 15 ? project.description.slice(0,15)+"..." : project.description) || "No description provided."}
                                    </p>
                                </div>
                                <div>
                                    <button
                                        className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition mr-1"
                                        onClick={() => navigate(`/${userType}/view_project/${username}/${project._id}`)}
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
                                        {(project.description.length > 15 ? project.description.slice(0,15)+"..." : project.description) || "No description provided."}
                                    </p>
                                </div>
                                <div>
                                    <button
                                        className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition mr-1"
                                        onClick={() => navigate(`/${userType}/view_project/${username}/${project._id}`)}
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
            </div> )
        : null   
        }      

            <div className="w-full flex justify-center items-center">
                <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => navigate(`/${userType}/profile/${username}`)}
                    >
                    Go to Profile
                </button>
            </div>
      </div>)
      :(
        <div className="w-full md:w-[60vw] h-auto flex flex-col justify-center items-start bg-slate-50 rounded-md shadow-lg p-6 space-y-4">
            <Skeleton className="w-4/5 h-16" />
            <Skeleton className="w-3/5 h-12" />
            <Skeleton className="w-2/5 h-8" />
            <Skeleton className="w-5/6 h-20" />
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-4/6 h-10" />
            <Skeleton className="w-4/6 h-14" />
            <Skeleton className="w-1/3 h-14" />
        </div>

      )}
    </div>
            
    </div>

  )
}
export default ViewProjects