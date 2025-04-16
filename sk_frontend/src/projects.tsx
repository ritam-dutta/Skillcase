import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./components/header";
// import Loader from "./components/loader";
import { useSocket } from "./context/socket.context";
import { Skeleton } from "./components/ui/skeleton";
import { Bookmark, Heart } from "lucide-react";

interface Project {
    title: string;
    description: string;
    budget: string;
    duration: string;
    industry: string;
    employer: string;
    collaborators: string[];
    freelancers: string[];
    status: string;
    _id: string;
    likedBy: any[];
}
const ProjectPage: React.FC = ({}) => {
    const {username} = useParams<{ username: string }>();
    // const url = window.location.href;
    // const role = url.includes("freelancer") ? "freelancer" : "client";
    const [projects, setProjects] = useState<Project[]>([]);
    const [savedProjects, setSavedProjects] = useState<any[]>([]);
    const [likedProjects, setLikedProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const loggedRole = localStorage.getItem("role") || "";
    const role = window.location.href.includes("freelancer") ? "freelancer" : "client";
    const loggedUsername = localStorage.getItem("username") || "";
    const accessToken = localStorage.getItem("accessToken") || "";
    // const [darkMode, setDarkMode] = useState(false);
    // const [isApplied, setIsApplied] = useState(false);
    const socket = useSocket();
    const navigate = useNavigate();
    // const [gotProjects, setGotProjects] = useState<Project[]>([]);
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            loggedUsername !== username ? navigate(`/${role}/profile/${username}`) : null;
            try {
                const response = await axios.get("http://localhost:8000/api/v1/root/getprojects");
                const response2 = await axios.get("http://localhost:8000/api/v1/root/getuserprojects",{
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        username: loggedUsername,
                        role: loggedRole
                    }
                });
                const responseLoggedUser = await axios.get(`http://localhost:8000/api/v1/${loggedRole}/loggedIn${loggedRole[0].toUpperCase()}${loggedRole.slice(1)}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const fetchedProjects = response.data.data;
                let gotProjects = response2.data.data;
                let fetchedsavedProjects = responseLoggedUser.data.data.freelancer?.savedProjects || responseLoggedUser.data.data.client?.savedProjects;
                let fetchedlikedProjects = responseLoggedUser.data.data.freelancer?.likedProjects || responseLoggedUser.data.data.client?.likedProjects;
                setLikedProjects(fetchedlikedProjects);
                setSavedProjects(fetchedsavedProjects);
                let requestedProjects = loggedRole === "freelancer" ? responseLoggedUser.data.data.freelancer?.applications : responseLoggedUser.data.data.client?.collabRequests;
                let newFetchedProjects = fetchedProjects
                                        .filter((project: Project) => project.status === "In Progress")
                                        .filter((project: Project) => 
                                            !(gotProjects || []).some((gotProject: Project) => gotProject._id === project._id) &&
                                            !(requestedProjects || []).some((requestedProject: Project) => requestedProject._id === project._id)
                                        );
                console.log("fetched projects",fetchedProjects)
                console.log("GotProjects:", gotProjects);
                console.log("requestedProjects:", requestedProjects);
                console.log("newFetchedProjects:", newFetchedProjects); 
                console.log("SavedProjects:", fetchedsavedProjects);
                console.log("LikedProjects:", fetchedlikedProjects);
                
                setProjects(newFetchedProjects);
                // if(fetchedProjects.requests.includes(loggedUsername)){
                //     setIsApplied(true);
                // }
                console.log("Projects:", projects);
            } catch (error) {
                console.error("Fetch Projects Error:", error);
            }
        };
        
        fetchProjects();
        setTimeout(() => setLoading(false), 200);
    }, []);

    // useEffect(() => {
    //     if (darkMode) {
    //       document.documentElement.classList.add("dark");
    //     } else {
    //       document.documentElement.classList.remove("dark");
    //     }
    //   }, [darkMode]);

    const applyProject = (id: string, employer: string ) => {
        try {
            setProjects(projects.filter((project: Project) => project._id !== id));
            socket?.emit("notification", { 
                accessToken: accessToken,
                notification: {
                    sender: loggedUsername,
                    senderRole: "freelancer",
                    projectId: id,
                    type: "apply for project",
                    receiver: employer,
                    receiverRole: "client",
                    message: `@${loggedUsername} wants to apply for this project.`	
                }
            });
            // setIsApplied(true);
        } catch (error) {
            console.error("Apply Project Error:", error);
        }
    };

    const collaborateProject = (id: string, employer: string ) => {
        try {
            setProjects(projects.filter((project: Project) => project._id !== id));
            socket?.emit("notification", { 
                accessToken: accessToken,
                notification: {
                    sender: loggedUsername,
                    senderRole: "client",
                    projectId: id,
                    type: "collaborate on project",
                    receiver: employer,
                    receiverRole: "client",
                    message: `@${loggedUsername} wants to collaborate with you on this project.`
                }
            });
            // setIsApplied(true);
        }
        catch (error) {
            console.error("Collaborate Project Error:", error);
        }
    };

    const SaveProject = async ( projectId: string) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/${role}/save_project/${username}`, { projectId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setSavedProjects([...savedProjects, projectId]);
            console.log("Project saved:", response.data);
        } catch (error) {
            console.error("Error saving project:", error);
        }
    };

    const unsaveProject = async ( projectId: string) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/${role}/unsave_project/${username}`, { projectId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setSavedProjects(savedProjects.filter((project: String) => project !== projectId));
            console.log("Project unsaved:", response.data);
        }
        catch (error) {
            console.error("Error unsaving project:", error);
        }
    };

    const likeProject = async ( projectId: string) => {
        try {
            await axios.post(`http://localhost:8000/api/v1/${role}/like_project/${username}`, { projectId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setLikedProjects([...likedProjects, projectId]);
            setProjects((prev) =>
              prev.map((pr) =>
                pr._id === projectId
                  ? { ...pr, likedBy: [...pr.likedBy, { username: loggedUsername, role: loggedRole }] }
                  : pr
              )
            );
            // console.log("Project liked:", response.data);
        } catch (error) {
            console.error("Error liking project:", error);
        }
    };

    const unlikeProject = async ( projectId: string) => {
        try {
            await axios.post(`http://localhost:8000/api/v1/${role}/unlike_project/${username}`, { projectId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setLikedProjects(likedProjects.filter((project: String) => project !== projectId));
            setProjects((prev) =>
              prev.map((pr) =>
                pr._id === projectId
                  ? { ...pr, likedBy: pr.likedBy.filter((like) => like.username !== loggedUsername || like.role !== loggedRole) }
                  : pr
              )
            );
            // console.log("Project unliked:", response.data);
        } catch (error) {
            console.error("Error unliking project:", error);
        }
    };

    const formatCount = (num: number) => {
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
      if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
      return num.toString();
    };
    

    return (
        <>
      <div
        className={
          projects.length > 6
            ? "h-full flex flex-col items-center text-[#1e3a8a] bg-gray-200 dark:bg-gray-600"
            : "min-h-screen sm:h-auto flex flex-col items-center text-[#1e3a8a] bg-gray-200 dark:bg-gray-600"
        }
      >
        <Header />
        <div className="lg:h-[18vh] sm:h-[10vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-800 dark:to-slate-900 flex items-center lg:items-start px-8">
          <h1 className="text-3xl text-white dark:text-gray-100 font-bold lg:mt-6">Available Projects</h1>
        </div>

        <main className="flex-grow w-[90%] max-w-[1200px] py-10">
          {/* <h2 className="text-3xl font-semibold mb-8 text-blue-900 dark:text-gray-100">Available Projects</h2> */}

          {!loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 bg-slate-300 dark:bg-slate-900 p-8 rounded-md overflow-auto lg:mt-[-13vh]">
              {projects.length === 0 ? (
                <p className="text-lg font-semibold dark:text-blue-400">No projects available</p>
              ) : null}
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="project-card bg-slate-100 dark:bg-slate-800 dark:border-gray-500 shadow-md rounded-lg p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between align-center">
                    <div>
                      <h3 className="text-xl dark:text-gray-200 font-bold mb-2">{project.title}</h3>
                      <p className="text-sm mb-4 dark:text-gray-200">
                        Description:{" "}
                        {project.description.length > 30
                          ? project.description.slice(0, 30) + "..."
                          : project.description}
                      </p>
                    </div>
                    <div className="flex flex-col justify-start items-center space-y-4">
                    {/* Bookmark Section */}
                    {!savedProjects?.includes(project._id) ? (
                      <Bookmark
                        onClick={() => SaveProject(project._id)}
                        className="cursor-pointer dark:text-blue-400"
                      />
                    ) : (
                      <Bookmark
                          stroke="none"
                        onClick={() => unsaveProject(project._id)}
                        className="cursor-pointer dark:text-blue-400 dark:fill-blue-400 fill-blue-500"
                      />
                    )}

                    {/* Heart & Like Count Section */}
                    <div className="flex flex-col items-center gap-1">
                      {!likedProjects?.includes(project._id) ? (
                        <Heart
                          size={22}
                          className="cursor-pointer dark:text-blue-400"
                          onClick={() => likeProject(project._id)}
                        />
                      ) : (
                        <Heart
                          stroke="none"
                          size={22}
                          className="cursor-pointer dark:text-blue-400 dark:fill-blue-400 fill-blue-500"
                          onClick={() => unlikeProject(project._id)}
                        />
                      )}
                      <p className="dark:text-blue-400 text-sm text-blue-700 font-sans font-medium">
                        {formatCount(projects.find((pr: Project) => pr._id === project._id)?.likedBy.length ?? 0)}
                      </p>
                    </div>
                  </div>

                  </div>

                  <div className="flex justify-between align-center w-full">
                    <div className="w-1/2 flex-col justify-between">
                      <p className="text-sm font-medium dark:text-gray-200">Budget: {project.budget}</p>
                      <p className="text-sm font-medium dark:text-gray-200">Duration: {project.duration}</p>
                    </div>
                    <div className="w-1/2 flex-col justify-between">
                      <p className="text-sm font-medium dark:text-blue-400">Industry: {project.industry}</p>
                      <Link
                        to={`/client/profile/${project.employer}`}
                        className="text-sm font-medium mb-4 text-blue-700 dark:text-blue-400"
                      >
                        Client: @{project.employer}
                      </Link>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="w-full mt-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                      onClick={() =>
                        navigate(`/${role}/view_feed_project/${username}/${project._id}`)
                      }
                    >
                      View
                    </button>
                    {loggedUsername === project.employer ? null : (
                      <button
                        className={
                          project.collaborators.includes(loggedUsername) ||
                          project.freelancers.includes(loggedUsername)
                            ? "w-full mt-2 py-2 bg-gray-300 dark:bg-gray-600 text-blue-950 dark:text-white rounded-lg transition-colors duration-300"
                            : "w-full mt-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                        }
                        onClick={() => {
                          loggedRole === "freelancer"
                            ? applyProject(project._id, project.employer)
                            : collaborateProject(project._id, project.employer);
                        }}
                      >
                        {loggedRole === "freelancer" ? "Apply" : "Collaborate"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 bg-slate-50 dark:bg-slate-800 p-8 rounded-md overflow-auto">
              <Skeleton className="w-full h-36 dark:bg-slate-700" />
              <Skeleton className="w-full h-36 dark:bg-slate-700" />
              <Skeleton className="w-full h-36 dark:bg-slate-700" />
              <Skeleton className="w-full h-36 dark:bg-slate-700" />
            </div>
          )}
        </main>
      </div>
    </>
    );
};

export default ProjectPage;
