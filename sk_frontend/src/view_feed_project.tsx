import Header from "./components/header";
import Footer from "./components/footer";
import Loader from "./components/loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface ViewFeedProject{}

const ViewFeedProject: React.FC<ViewFeedProject> = ({})=>{

    const [project, setProject] = useState<any>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [industry, setIndustry] = useState("");
    const [budget, setBudget] = useState("");
    const [duration, setDuration] = useState("");
    const [status, setStatus] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {projectid} = useParams();



    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            console.log(projectid)
            try {
                const response = await axios.get("http://localhost:8000/api/v1/root/currentproject", {
                    headers: {
                        projectId: projectid,
                    },
                }
                );
                const project = response.data.data;
                console.log(project)
                setProject(project);
                setTitle(project.title);
                setDescription(project.description);
                setIndustry(project.industry);
                setBudget(project.budget);
                setDuration(project.duration);
                setUsername(project.employer);
                setStatus(project.status);
                console.log("Projects:", project);
            } catch (error) {
                console.error("Fetch Projects Error:", error);
            }
            setLoading(false);
        };

        fetchProject();
    }, []);



    return(
        <>
        <Header />
        <div className="h-[85vh] w-screen bg-[url('/images/background.jpg')] bg-cover bg-center flex flex-col justify-between">
        {/* Title Section */}
        <div className="h-[15vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center px-8">
            <h1 className="text-3xl text-white font-bold">{title}</h1>
        </div>

        {/* Main Content */}
        <main className="h-[72vh] flex-grow w-full flex justify-center items-start py-6">
            {!loading ? (
            <div className="w-11/12 lg:w-3/5 bg-slate-50 shadow-lg rounded-lg p-8 mt-[-13vh]">
            {/* Form Content */}
            <div className="space-y-6">
                {/* Description */}
                <div>
                <label className="block text-md font-medium text-gray-700">Description</label>
                <div className="mt-1 h-24 w-full rounded-md bg-slate-100 border-blue-300 border-[1px] shadow-sm px-4 py-2">
                    {description}
                </div>
                </div>

                {/* Industry */}
                <div>
                <label className="block text-md font-medium text-gray-700">Industry</label>
                <div className="mt-1 w-full rounded-md bg-slate-100 border-blue-300 border-[1px] shadow-sm px-4 py-2">
                    {industry}
                </div>
                </div>

                {/* Budget */}
                <div>
                <label className="block text-md font-medium text-gray-700">Budget</label>
                <div className="mt-1 w-full rounded-md bg-slate-100 border-blue-300 border-[1px] shadow-sm px-4 py-2">
                    {budget}
                </div>
                </div>

                {/* Duration */}
                <div>
                <label className="block text-md font-medium text-gray-700">Duration</label>
                <div className="mt-1 w-full rounded-md bg-slate-100 border-blue-300 border-[1px] shadow-sm px-4 py-2">
                    {duration}
                </div>
                </div>

                {/* Status */}
                <div>
                <label className="block text-md font-medium text-gray-700">Status</label>
                <div className="mt-1 w-full rounded-md bg-slate-100 border-blue-300 border-[1px] shadow-sm px-4 py-2">
                    {status}
                </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center items-center">
                
                <button
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={() => navigate(`/client/projects/${username}`)}
                >
                Go Back
                </button>
            </div>
            </div>):
            (
                <div className="h-[70vh] w-[50vw] flex justify-center items-center bg-slate-50 rounded-md shadow-lg mt-[-13vh]">
                    <Loader />
                </div>
            )
    }
        </main>
        </div>
        <Footer />

        </>
    )
}

export default ViewFeedProject;