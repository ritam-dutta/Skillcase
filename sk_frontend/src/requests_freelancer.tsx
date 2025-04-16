import Header from "./components/header";
import { Skeleton } from "./components/ui/skeleton";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


// interface Request{
//     sender: string;
//     receiver: string;
//     senderRole: string;
//     receiverRole: string;
//     message: string;
//     type: string;
//     project: string;
// }

const MyRequestsFreelancer: React.FC = ({}) => {
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const loggedUsername = localStorage.getItem("username");
    const loggedInRole = localStorage.getItem("role") || "";
    const accessToken = localStorage.getItem("accessToken");
    const [applications, setApplications] = useState<any[]>([]);
    // const [acceptedRequests, setAcceptedRequests] = useState<any[]>([]);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
            
                const responseLoggedUser = await axios.get(`http://localhost:8000/api/v1/${loggedInRole}/loggedIn${loggedInRole[0].toUpperCase()}${loggedInRole.slice(1)}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }); 
                const user = responseLoggedUser.data.data.freelancer;
                setApplications(user.applications);

            } catch (error) {
                console.error("Fetch Notifications Error:", error);
            }
        };
        fetchRequests();
        setTimeout(() => setLoading(false), 200);
    }, [loggedUsername, navigate]);




    return (
        <>
           <Header />
<div className="h-[92vh] w-screen bg-gray-200 dark:bg-gray-600 flex flex-col justify-between">
    {/* Title Section */}
    <div className="h-[15vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-800 dark:to-slate-900 flex items-center px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl text-white font-bold dark:text-gray-100">My Requests</h1>
    </div>

    {/* Main Content */}
    <main className="h-[72vh] flex-grow w-full flex justify-center items-start py-6">
        {!loading ? (
        <div className="w-11/12 sm:w-10/12 md:w-3/4 lg:w-1/2 bg-slate-50 dark:bg-slate-900  shadow-lg rounded-lg p-6 sm:p-8 lg:mt-[-13vh]">
            {/* Form Content */}
            <div className="space-y-6">
                {/* Description */}
                <div>
                    <div className="flex items-center justify-center">
                        <p className="font-bold mb-2 text-lg sm:text-xl dark:text-gray-200 ">Requests In Process</p>
                    </div>
                    {applications.length > 0 ? (
                        applications.map((application, index) => (
                            <div key={index} className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-4 shadow-md rounded-md">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-full bg-gray-300 p-2">
                                        <img src="/images/user.png" alt="" className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-l dark:text-gray-200">Application for project has been sent to</p>
                                        <Link to={`/client/profile/${application.client}`} className="text-l dark:text-blue-200">
                                             @{application.client}!
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="bg-blue-500 text-white text-center px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 transition"
                                        onClick={() => navigate(`/client/view_project/${application.client}/${application.projectId}`)}
                                    >
                                        View Project
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 p-4 rounded-md shadow-md">
                            <h3 className="text-xl dark:text-gray-200">No Requests Yet</h3>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => navigate(`/${loggedInRole}/profile/${loggedUsername}`)}
                >
                    Go Back
                </button>
            </div>
        </div>
        ) : (
            <div className="h-[65vh] w-[80%] sm:w-[60%] lg:w-[50%] flex flex-col gap-3 justify-center items-start bg-slate-50 dark:bg-slate-800 rounded-md mt-[-13vh] p-4">
                <Skeleton className="w-4/5 h-12 dark:bg-slate-700" />
                <Skeleton className="w-3/5 h-10 dark:bg-slate-700" />
                <Skeleton className="w-3/5 h-10 dark:bg-slate-700" />
                <Skeleton className="w-2/5 h-8 dark:bg-slate-700" />
                <Skeleton className="w-5/6 h-16 dark:bg-slate-700" />
                <Skeleton className="w-5/6 h-16 dark:bg-slate-700" />
                <Skeleton className="w-full h-12 dark:bg-slate-700" />
                <Skeleton className="w-4/6 h-8 dark:bg-slate-700" />
                <Skeleton className="w-4/6 h-10 dark:bg-slate-700" />
                <Skeleton className="w-1/3 h-10 dark:bg-slate-700" />
            </div>
        )}
    </main>
</div>
        </>
    );
}

export default MyRequestsFreelancer;