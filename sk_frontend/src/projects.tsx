import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./components/header";
import Loader from "./components/loader";
import { useSocket } from "./context/socket.context";

interface ProjectPage {}
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
}
const ProjectPage: React.FC<ProjectPage> = ({}) => {
    const {username} = useParams<{ username: string }>();
    // const url = window.location.href;
    // const role = url.includes("freelancer") ? "freelancer" : "client";
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const loggedRole = localStorage.getItem("role");
    const loggedUsername = localStorage.getItem("username") || "";
    const accessToken = localStorage.getItem("accessToken") || "";
    const socket = useSocket();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8000/api/v1/root/getprojects");
                const projects = response.data.data;
                setProjects(projects.filter((project: Project) => project.status === "In Progress"));
                console.log("Projects:", projects);
            } catch (error) {
                console.error("Fetch Projects Error:", error);
            }
            setLoading(false);
        };

        fetchProjects();
    }, []);

    const applyProject = (id: string, employer: string ) => {
        try {
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
        } catch (error) {
            console.error("Apply Project Error:", error);
        }
    };

    const collaborateProject = (id: string, employer: string ) => {
        try {
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
        }
        catch (error) {
            console.error("Collaborate Project Error:", error);
        }
    };

    return (
        <>
            <div className={projects.length > 6 ? " h-full flex flex-col items-center text-[#1e3a8a] bg-[url('/images/background.jpg')] bg-cover bg-center" : " h-lvh flex flex-col items-center text-[#1e3a8a] bg-[url('/images/background.jpg')] bg-cover bg-center"}>
            <Header />
            <main className="flex-grow w-[90%] max-w-[1200px] py-10">
                <h2 className="text-3xl font-semibold mb-8">Available Projects</h2>
                {!loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-slate-50 p-8 rounded-md overflow-auto">
                    {projects.map(project => (
                        <div
                            key={project._id}
                            className="project-card bg-slate-100 shadow-md rounded-lg p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow duration-300"
                        >
                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                            <p className="text-sm mb-4">Description: {project.description}</p>
                            <div className="flex justify-between align-center">
                                <div>
                                    <p className="text-sm font-medium">Budget: {project.budget}</p>
                                    <p className="text-sm font-medium">Duration: {project.duration}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Industry: {project.industry}</p>
                                    <Link to={`/client/profile/${project.employer}`} className="text-sm font-medium mb-4">Client: @{project.employer}</Link>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="w-full mt-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                    onClick={() => navigate(`/client/view_feed_project/${username}/${project._id}`)}
                                >
                                    View
                                </button>
                                {loggedUsername === project.employer ? null : (
                                <button
                                    className={ (project.collaborators.includes(loggedUsername) ||project.freelancers.includes(loggedUsername) ) ? "w-full mt-2 py-2 bg-gray-300 text-blue-950 rounded-lg hover:bg-gray-300 transition-colors duration-300" : "w-full mt-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"}
                                    onClick={() => {loggedRole === "freelancer" ? project.freelancers.includes(loggedUsername) ? null : applyProject(project._id, project.employer) : project.collaborators.includes(loggedUsername) ? null : collaborateProject(project._id, project.employer)}}
                                >
                                    {loggedRole === "freelancer" ? project.freelancers.includes(loggedUsername) ? "Applied" : "Apply" : project.collaborators.includes(loggedUsername) ? "Collaborated" : "Collaborate"}
                                </button>
                                )
                                }
                            </div>
                        </div>
                    ))}
                </div>)
                :(
                    <div className="h-[50vh] flex justify-center items-center bg-slate-50">
                        <Loader />
                    </div>
                )}
            </main>
            
            <footer className="w-full h-[8vh] flex justify-center items-center bg-[#1e3a8a] text-white">
                <p className="text-sm">&copy; 2025 Skillcase. All rights reserved.</p>
            </footer>
            </div> 
        </>
    );
};

export default ProjectPage;
