import Header from "./components/header";
import Loader from "./components/loader";
import Footer from "./components/footer";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useNotification } from "./context/notifications.context";
import { useSocket } from "./context/socket.context";
interface Requests {}

// interface Request{
//     sender: string;
//     receiver: string;
//     senderRole: string;
//     receiverRole: string;
//     message: string;
//     type: string;
//     project: string;
// }

const Requests: React.FC<Requests> = ({}) => {
    
    const [loading, setLoading] = useState(false);
    const {projectid} = useParams<{projectid : string}>();
    const socket = useSocket();
    const navigate = useNavigate();
    const { requests, setRequests } = useNotification();
    const loggedUsername = localStorage.getItem("username");
    const loggedRole = localStorage.getItem("role");
    const accessToken = localStorage.getItem("accessToken");
    const filteredRequests = requests.filter((application) => application.type === "apply for project" && application.projectId === projectid);
    const filteredCollaborations = requests.filter((collaboration) => collaboration.type === "collaborate on project" && collaboration.projectId === projectid);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/${loggedRole}/get_notifications/${loggedUsername}`,{
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        // role: loggedRole,
                    }
                });
                const fetchedNotifications = response.data.data.notifications;
                console.log(fetchedNotifications)
                setRequests(fetchedNotifications.filter((notification: any) => notification.type === "apply for project" || notification.type === "collaborate on project"));

            } catch (error) {
                console.error("Fetch Notifications Error:", error);
            }
            console.log("req", requests)
            setLoading(false);
        };
        fetchRequests();
    }, [loggedUsername, navigate]);

    const acceptApplication = (sender: string, projectId: string) => {
        try {
            setRequests(requests.filter((request) => request.sender !== sender || request.projectId !== projectId))
            socket?.emit("accept application", {
                accessToken: accessToken,
                info:{
                    sender: sender,
                    receiver: loggedUsername,
                    projectId: projectId
                }
            });
        } catch (error) {
            console.error("Accept Project Application Error:", error);
        }
    }

    const rejectApplication = (sender: string, projectId: string) => {
        try {
            setRequests(requests.filter((request) => request.sender !== sender || request.projectId !== projectId))
            socket?.emit("reject application", {
                accessToken: accessToken,
                info:{
                    sender: sender,
                    receiver: loggedUsername,
                    projectId: projectId
                }
            });
        } catch (error) {
            console.error("Reject Project Application Error:", error);
        }
    }

    const acceptCollaboration = (sender: string, projectId: string) => {
        try {
            setRequests(requests.filter((request) => request.sender !== sender || request.projectId !== projectId))
            socket?.emit("accept collaboration", {
                accessToken: accessToken,
                info:{
                    sender: sender,
                    receiver: loggedUsername,
                    projectId: projectId
                }
            });
        } catch (error) {
            console.error("Accept Project Collaboration Error:", error);
        }
    }

    const rejectCollaboration = (sender: string, projectId: string) => {
        try {
            setRequests(requests.filter((request) => request.sender !== sender || request.projectId !== projectId))
            socket?.emit("reject collaboration", {
                accessToken: accessToken,
                info:{
                    sender: sender,
                    receiver: loggedUsername,
                    projectId: projectId
                }
            });
        } catch (error) {
            console.error("Reject Project Collaboration Error:", error);
        }
    }

    return (
        <>
           <Header />
        <div className="h-[85vh] w-screen bg-[url('/images/background.jpg')] bg-cover bg-center flex flex-col justify-between">
        {/* Title Section */}
        <div className="h-[15vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center px-8">
            <h1 className="text-3xl text-white font-bold">Requests</h1>
        </div>

        {/* Main Content */}
        <main className="h-[72vh] flex-grow w-full flex justify-center items-start py-6">
            {!loading ? (
            <div className="w-11/12 lg:w-1/2 bg-slate-50 shadow-lg rounded-lg p-8 mt-[-13vh]">
            {/* Form Content */}
                <div className="space-y-6">
                    {/* Description */}
                    <div>
                        <div>
                        <div className="flex items-center justify-center">
                            <p className="font-bold mb-2">Applications </p>
                        </div>
                        {filteredRequests.length > 0 ? (
                            filteredRequests
                            .map((application, index) => (
                                <div key={index} className="flex items-center justify-between bg-slate-100 p-4 shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-gray-300 p-2">
                                            <img src="/images/user.png" alt="" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <Link to={`/${application.senderRole}/profile/${application.sender}`} className="text-xl">
                                                @{application.sender}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="bg-blue-500 text-white text-center px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 transition"
                                            onClick={() => acceptApplication(application.sender, application.projectId)}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="bg-gray-200 text-blue-950 text-center px-3 py-1 rounded-lg shadow-md hover:bg-gray-300 transition"
                                            onClick={() => rejectApplication(application.sender, application.projectId)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="flex items-center justify-center bg-slate-100 p-4 rounded-md shadow-md">
                            <h3 className="text-xl">No Applications Yet</h3>
                        </div>
                    )}

                    </div>
                    <div className="mt-6">	
                        <div className="flex items-center justify-center">
                            <p className="font-bold mb-2">Collaborations</p>
                        </div>
                        {filteredCollaborations.length > 0 ? (filteredCollaborations.map((collaboration, index) => (
                            <div key={index} className="flex items-center justify-between bg-slate-100 p-4 shadow-md">
                                <div className="flex items-center gap-4"> 
                                    <div className="rounded-full bg-gray-300 p-2">
                                        <img src="/images/user.png" alt=""  className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <Link to={`/${collaboration.senderRole}/profile/${collaboration.sender}`} className="text-xl">@{collaboration.sender}</Link>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                    className=" bg-blue-500 text-white text-center px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 transition"
                                    onClick={() => acceptCollaboration(collaboration.sender, collaboration.projectId)}
                                    >
                                    Accept
                                    </button>
                                    <button
                                    className=" bg-gray-200 text-blue-950 text-center px-3 py-1  rounded-lg shadow-md hover:bg-gray-300 transition"
                                    onClick={() => rejectCollaboration(collaboration.sender, collaboration.projectId)}
                                    >
                                    Reject
                                    </button>
                                </div>
                            </div>
                        ))
                        ) : (
                            <div className="flex items-center justify-center bg-slate-100 p-4 rounded-md shadow-md">
                                <h3 className="text-xl ">No Collaborations Yet</h3>
                            </div>
                    )}
                    </div>
                    </div>

                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-10 justify-center items-center">
                        
                        <button
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => navigate(`/${loggedRole}/view_projects/${loggedUsername}`)}
                        >
                        Go Back
                        </button>

                    </div>
                </div>
            </div>)
            :(
                <div>
                    <div className="h-[65vh] w-[50vw] flex justify-center items-center bg-slate-50 rounded-md shadow-lg mt-[-13vh]">
                        <Loader />
                    </div>
                </div>
            )
        }
        
        </main>
        </div>
        <Footer />
        </>
    );
}

export default Requests;