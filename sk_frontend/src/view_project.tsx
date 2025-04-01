import Header from "./components/header";
import { Skeleton } from "./components/ui/skeleton";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface ViewProject{}

const ViewProject: React.FC<ViewProject> = ({})=>{

    // const [project, setProject] = useState<any>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [industry, setIndustry] = useState("");
    const [budget, setBudget] = useState("");
    const [duration, setDuration] = useState("");
    const [status, setStatus] = useState("");
    const [employer, setEmployer] = useState("");
    const {username} = useParams<{username:string}>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {projectid} = useParams();
    const currentRole = window.location.href.includes("client") ? "client" : "freelancer";


    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            // console.log(projectid)
            try {
                const response = await axios.get("http://localhost:8000/api/v1/root/currentproject", {
                    headers: {
                        projectId: projectid,
                    },
                }
                );
                const project = response.data.data;
                console.log(project)
                // setProject(project);
                setTitle(project.title);
                setEmployer(project.employer);
                setDescription(project.description);
                setIndustry(project.industry);
                setBudget(project.budget);
                setDuration(project.duration);
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
<div className="min-h-screen w-full bg-[url('/images/background.jpg')] bg-cover bg-center flex flex-col">
    {/* Title Section */}
    <div className="h-[15vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center px-6 md:px-8">
        <h1 className="text-2xl md:text-3xl text-white font-bold">{title}</h1>
    </div>

    {/* Main Content */}
    <main className="flex-grow w-full flex justify-center items-start py-6 px-4 md:px-0">
        {!loading ? (
            <div className="w-full md:w-4/5 lg:w-3/5 bg-slate-50 shadow-lg rounded-lg p-6 md:p-8 lg:mt-[-8vh] flex flex-col">
                {/* Scrollable Content */}
                <div className="space-y-6 overflow-auto flex-grow pr-2">
                    {/* Description */}
                    <div>
                        <label className="block text-md font-medium text-gray-700">Description</label>
                        <textarea
                            className="mt-1 h-24 w-full rounded-md bg-slate-100 border-blue-300 border shadow-sm px-4 py-2 resize-none overflow-auto"
                            value={description}
                            readOnly
                        />
                    </div>

                    {/* Employer */}
                    <div>
                        <label className="block text-md font-medium text-gray-700">Employer</label>
                        <div className="mt-1 w-full rounded-md bg-slate-100 border-blue-300 border shadow-sm px-4 py-2">
                            {employer}
                        </div>
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="block text-md font-medium text-gray-700">Industry</label>
                        <div className="mt-1 w-full rounded-md bg-slate-100 border-blue-300 border shadow-sm px-4 py-2">
                            {industry}
                        </div>
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="block text-md font-medium text-gray-700">Budget</label>
                        <div className="mt-1 w-full rounded-md bg-slate-100 border-blue-300 border shadow-sm px-4 py-2">
                            {budget}
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-md font-medium text-gray-700">Duration</label>
                        <div className="mt-1 w-full rounded-md bg-slate-100 border-blue-300 border shadow-sm px-4 py-2">
                            {duration}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-md font-medium text-gray-700">Status</label>
                        <div className="mt-1 w-full rounded-md bg-slate-100 border-blue-300 border shadow-sm px-4 py-2">
                            {status}
                        </div>
                    </div>
                </div>

                {/* Action Buttons (Sticky at Bottom) */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-10 justify-center items-center">
                    <button
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full sm:w-auto"
                        onClick={() => navigate(`/${currentRole}/profile/${username}`)}
                    >
                        Go to Profile
                    </button>
                    <button
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full sm:w-auto"
                        onClick={() => { currentRole === "client" ? navigate(`/client/my_projects/${username}`) : navigate(`/freelancer/view_projects/${username}`) }}
                    >
                        View All Projects
                    </button>
                </div>
            </div>
        ) : (
            <div className="w-full md:w-4/5 lg:w-3/5 bg-slate-50 shadow-lg rounded-lg p-6 md:p-8 mt-[-8vh] flex flex-col gap-5">
                <Skeleton className="w-full h-16" />
                <Skeleton className="w-3/5 h-12" />
                <Skeleton className="w-2/5 h-8" />
                <Skeleton className="w-5/6 h-20" />
                <Skeleton className="w-full h-14" />
                <Skeleton className="w-4/6 h-10" />
                <Skeleton className="w-4/6 h-14" />
                <Skeleton className="w-1/3 h-14" />
            </div>
        )}
    </main>
</div>


        </>
    )
}

export default ViewProject;