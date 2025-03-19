import Header from "./components/header";
import Footer from "./components/footer";
import { Skeleton } from "./components/ui/skeleton";
// import Loader from "./components/loader";
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
    const loggedUsername = localStorage.getItem("username");
    const role = window.location.href.includes("client") ? "client" : "freelancer";



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
            setTimeout(() => setLoading(false), 200);
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
            <div className="w-11/12 lg:w-3/5 h-[85vh] bg-slate-50 shadow-lg rounded-lg p-8 mt-[-13vh] flex flex-col">
            {/* Scrollable Content */}
            <div className="space-y-6 overflow-auto flex-grow pr-2">
                {/* Description */}
                <div>
                    <label className="block text-md font-medium text-gray-700">Description</label>
                    <textarea
                        className="mt-1 h-48 w-full rounded-md bg-slate-100 border-blue-300 border-[1px] shadow-sm px-4 py-2 resize-none overflow-auto"
                        value={description}
                        readOnly
                    />
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
        
            {/* Action Button (Fixed at Bottom) */}
            <div className="mt-6 flex justify-center items-center">
                <button
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    onClick={() => navigate(`/${role}/projects/${loggedUsername}`)}
                >
                    Go Back
                </button>
            </div>
        </div>
        ):
            (
                <div className="w-11/12 lg:w-3/5 h-[85vh] bg-slate-50 shadow-lg rounded-lg p-8 mt-[-13vh] flex flex-col gap-5">
                    <Skeleton className="w-4/5 h-16" />
                    <Skeleton className="w-3/5 h-12" />
                    <Skeleton className="w-2/5 h-8" />
                    <Skeleton className="w-5/6 h-20" />
                    <Skeleton className="w-full h-14" />
                    <Skeleton className="w-4/6 h-10" />
                    <Skeleton className="w-4/6 h-14" />
                    <Skeleton className="w-1/3 h-14" />
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