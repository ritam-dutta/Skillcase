import Header from "./components/header";
import Loader from "./components/loader";
import Footer from "./components/footer";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
interface Connections {}
const Connections: React.FC<Connections> = ({}) => {

    const [loading, setLoading] = useState(false);
    const [connections, setConnections] = useState([]);
    const [clientConnections, setClientConnections] = useState<any[]>([]);
    const [freelancerConnections, setFreelancerConnections] = useState<any[]>([]);
    const [isAlreadyConnected, setIsAlreadyConnected] = useState(false);
    const [alreadyConnectedUser, setAlreadyConnectedUser] = useState({});
    const {username} = useParams();
    const navigate = useNavigate();
    const currentRole = window.location.href.includes("client") ? "client" : "freelancer";

    useEffect(() => {
        const fetchConnections = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/${currentRole}/getconnections/${username}`);
                const fetchedConnections = response.data.data.connections;
                setConnections(fetchedConnections);
                let clientList: any[] = [];
                let freelancerList: any[] = [];
                let alreadyConnected = false;
                let connectedUser = {};
                
                fetchedConnections.forEach(connection => {
                    if(connection.username === localStorage.getItem("username")) {
                        alreadyConnected = true;
                        connectedUser = connection;
                    } else if(connection.role === "client") {
                        clientList.push(connection);
                    } else if(connection.role === "freelancer") {
                        freelancerList.push(connection);
                    }
                });
                setAlreadyConnectedUser(connectedUser);
                setIsAlreadyConnected(alreadyConnected);
                setClientConnections(clientList);
                setFreelancerConnections(freelancerList);
            } catch (error) {
                console.error("Fetch Projects Error:", error);
            }
            setLoading(false);
        };
        fetchConnections();
    }, [username, navigate]);

    return (
        <>
           <Header />
        <div className="h-[85vh] w-screen bg-[url('/images/background.jpg')] bg-cover bg-center flex flex-col justify-between">
        {/* Title Section */}
        <div className="h-[15vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center px-8">
            <h1 className="text-3xl text-white font-bold">Followers</h1>
        </div>

        {/* Main Content */}
        <main className="h-[72vh] flex-grow w-full flex justify-center items-start py-6">
            {!loading ? (
            <div className="w-11/12 lg:w-3/5 bg-slate-50 shadow-lg rounded-lg p-8 mt-[-13vh]">
            {/* Form Content */}
                <div className="space-y-6">
                    {/* Description */}
                    <div>
                    {isAlreadyConnected ? (
                        <div  className="bg-slate-100 p-4 rounded-md shadow-md flex flex-col items-center justify-center gap-4 mb-5">
                            <p className="font-bold">You are connected with each other </p>
                            <div className="flex justify-between w-full -mt-4">
                                <div className="flex gap-4 items-center"> 
                                    <div className="rounded-full bg-gray-300 p-2">
                                        <img src="/images/user.png" alt=""  className="h-5 w-5"/>
                                    </div>
                                    <div >
                                        <Link to={`/${alreadyConnectedUser.role}/profile/${alreadyConnectedUser.username}`} className="text-xl">@{alreadyConnectedUser.username}</Link>
                                    </div>
                                </div>
                                <div>
                                    <button
                                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={() => navigate(`/${alreadyConnectedUser.role}/view_projects/${alreadyConnectedUser.username}`)}
                                    >
                                    View Projects
                                    </button>
                                </div>
                            </div>
                        </div>

                        )
                        : null}
                        <div>
                        <div className="flex items-center justify-center">
                            <p className="font-bold">Clients</p>
                        </div>
                        {clientConnections.length > 0 ? clientConnections.map(connection => (
                            <div key={connection._id} className="flex items-center justify-between bg-slate-100 p-4 shadow-md">
                                <div className="flex items-center gap-4"> 
                                    <div className="rounded-full bg-gray-300 p-2">
                                        <img src="/images/user.png" alt=""  className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <Link to={`/client/profile/${connection.username}`} className="text-xl">@{connection.username}</Link>
                                    </div>
                                </div>
                                <div>
                                    <button
                                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={() => navigate(`/client/view_projects/${connection.username}`)}
                                    >
                                    View Projects
                                    </button>
                                </div>
                            </div>
                        )
                        ) : (
                            <div className="flex items-center justify-center bg-slate-100 p-4 rounded-md shadow-md">
                                <h3 className="text-xl">No Client Connections Yet</h3>
                            </div>
                    )}
                    </div>
                    <div className="mt-6">	
                        <div className="flex items-center justify-center">
                            <p className="font-bold mb-2">Freelancers</p>
                        </div>
                        {freelancerConnections.length > 0 ? freelancerConnections.map(connection => (
                            <div key={connection._id} className="flex items-center justify-between bg-slate-100 p-4 shadow-md">
                                <div className="flex items-center gap-4"> 
                                    <div className="rounded-full bg-gray-300 p-2">
                                        <img src="/images/user.png" alt=""  className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <Link to={`/${connection.role}/profile/${connection.username}`} className="text-xl">@{connection.username}</Link>
                                    </div>
                                </div>
                                <div>
                                    <button
                                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={() => navigate(`/${connection.role}/view_projects/${connection.username}`)}
                                    >
                                    View Projects
                                    </button>
                                </div>
                            </div>
                        )
                        ) : (
                            <div className="flex items-center justify-center bg-slate-100 p-4 rounded-md shadow-md">
                                <h3 className="text-xl ">No Freelancer Connections Yet</h3>
                            </div>
                    )}
                    </div>
                    </div>

                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-10 justify-center items-center">
                        
                        <button
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => navigate(`/${currentRole}/profile/${username}`)}
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

export default Connections;