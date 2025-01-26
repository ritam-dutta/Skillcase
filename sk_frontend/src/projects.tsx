import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./components/header";

interface ProjectPage {}
const ProjectPage: React.FC<ProjectPage> = ({}) => {
    const {username} = useParams<{ username: string }>();
    const url = window.location.href;
    const role = url.includes("freelancer") ? "freelancer" : "client";
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/root/getprojects");
                const projects = response.data.data;
                setProjects(projects);
                console.log("Projects:", projects);
            } catch (error) {
                console.error("Fetch Projects Error:", error);
            }
        };

        fetchProjects();
    }, []);

    // const navView = (id) => {
    //     if (id) {
    //         localStorage.setItem("projectId", id);
    //         navigate(`/client/view_feed_project/${username}`);
    //     } else {
    //         console.error("Invalid project ID");
    //     }
    // }

    return (
        <>
            
            <body className=" h-screen flex flex-col items-center bg-[#f7faff] text-[#1e3a8a] bg-[url('/images/background.jpg')] bg-cover bg-center">
            <Header />
            <main className="flex-grow w-[90%] max-w-[1200px] py-10">
                <h2 className="text-3xl font-semibold mb-8">Available Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => (
                        <div
                            key={projects._id}
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
                            <button
                                className="w-full mt-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                onClick={() => navigate(`/client/view_feed_project/${project._id}`)}
                            >
                                {role === "freelancer" ? "Apply" : "View"}
                            </button>
                        </div>
                    ))}
                </div>
            </main>
            
            <footer className="w-full h-[8vh] flex justify-center items-center bg-[#1e3a8a] text-white">
                <p className="text-sm">&copy; 2025 Skillcase. All rights reserved.</p>
            </footer>
            </body> 
        </>
    );
};

export default ProjectPage;
