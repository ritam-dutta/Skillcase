import Header from "./components/header";
import Loader from "./components/loader";
import Footer from "./components/footer";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
interface Followings {}

interface Following{
    _id: string;
    username: string;
    role: string;
}
const Followings: React.FC<Followings> = ({}) => {

    const [loading, setLoading] = useState(false);
    const [followings, setFollowings] = useState([]);
    const [clientFollowings, setClientFollowings] = useState<any[]>([]);
    const [freelancerFollowings, setFreelancerFollowings] = useState<any[]>([]);
    const [isAlreadyFollowing, setIsAlreadyFollowing] = useState(false);
    const [alreadyFollowingUser, setAlreadyFollowingUser] = useState<Following>();
    const {username} = useParams();
    const navigate = useNavigate();
    const currentRole = window.location.href.includes("client") ? "client" : "freelancer";

    useEffect(() => {
        const fetchFollowings = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/${currentRole}/getfollowings/${username}`);
                const fetchedFollowings = response.data.data.followings;
                console.log(fetchedFollowings)
                setFollowings(fetchedFollowings);
                let clientList: any[] = [];
                let freelancerList: any[] = [];
                let alreadyFollowing = false;
                let followingUser: Followings | undefined = undefined;

                fetchedFollowings.forEach((following: any) => {
                    if(following.username === localStorage.getItem("username")) {
                        alreadyFollowing = true;
                        followingUser = following;
                    } else if(following.role === "client") {
                        clientList.push(following);
                    } else if(following.role === "freelancer") {
                        freelancerList.push(following);
                    }
                });
                setAlreadyFollowingUser(followingUser);
                setIsAlreadyFollowing(alreadyFollowing);
                setClientFollowings(clientList);
                setFreelancerFollowings(freelancerList);

            } catch (error) {
                console.error("Fetch Projects Error:", error);
            }
            setLoading(false);
        };
        fetchFollowings();
    }, [username, navigate]);

    return (
        <>
           <Header />
        <div className="h-[85vh] w-screen bg-[url('/images/background.jpg')] bg-cover bg-center flex flex-col justify-between">
        {/* Title Section */}
        <div className="h-[15vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center px-8">
            <h1 className="text-3xl text-white font-bold">Followings</h1>
        </div>

        {/* Main Content */}
        <main className="h-[72vh] flex-grow w-full flex justify-center items-start py-6">
            {!loading ? (
            <div className="w-11/12 lg:w-3/5 bg-slate-50 shadow-lg rounded-lg p-8 mt-[-13vh]">
            {/* Form Content */}
                <div className="space-y-6">
                    {/* Description */}
                    <div>
                    {isAlreadyFollowing ? (
                        <div  className="bg-slate-100 p-4 rounded-md shadow-md flex flex-col items-center justify-center gap-4 mb-5">
                            <p className="font-bold">You both follow each other </p>
                            <div className="flex justify-between w-full -mt-4">
                                <div className="flex gap-4 items-center"> 
                                    <div className="rounded-full bg-gray-300 p-2">
                                        <img src="/images/user.png" alt=""  className="h-5 w-5"/>
                                    </div>
                                    <div >
                                        <Link to={`/${alreadyFollowingUser?.role}/profile/${alreadyFollowingUser?.username}`} className="text-xl">@{alreadyFollowingUser?.username}</Link>
                                    </div>
                                </div>
                                <div>
                                    <button
                                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={() => {
                                        if (alreadyFollowingUser) {
                                            navigate(`/${alreadyFollowingUser.role}/view_projects/${alreadyFollowingUser.username}`);
                                        }
                                    }}
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
                        {clientFollowings.length > 0 ? clientFollowings.map(following => (
                            <div key={following._id} className="flex items-center justify-between bg-slate-100 p-4 shadow-md">
                                <div className="flex items-center gap-4"> 
                                    <div className="rounded-full bg-gray-300 p-2">
                                        <img src="/images/user.png" alt=""  className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <Link to={`/client/profile/${following.username}`} className="text-xl">@{following.username}</Link>
                                    </div>
                                </div>
                                <div>
                                    <button
                                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={() => navigate(`/client/projects/${following.username}`)}
                                    >
                                    View Projects
                                    </button>
                                </div>
                            </div>
                        )
                        ) : (
                            <div className="flex items-center justify-center bg-slate-100 p-4 rounded-md shadow-md">
                                <h3 className="text-xl">Not following any Clients!</h3>
                            </div>
                    )}
                    </div>
                    <div className="mt-6">	
                        <div className="flex items-center justify-center">
                            <p className="font-bold mb-2">Freelancers</p>
                        </div>
                        {freelancerFollowings.length > 0 ? freelancerFollowings.map(follower => (
                            <div key={follower._id} className="flex items-center justify-between bg-slate-100 p-4 shadow-md">
                                <div className="flex items-center gap-4"> 
                                    <div className="rounded-full bg-gray-300 p-2">
                                        <img src="/images/user.png" alt=""  className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <Link to={`/${follower.role}/profile/${follower.username}`} className="text-xl">@{follower.username}</Link>
                                    </div>
                                </div>
                                <div>
                                    <button
                                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={() => navigate(`/${follower.role}/view_projects/${follower.username}`)}
                                    >
                                    View Projects
                                    </button>
                                </div>
                            </div>
                        )
                        ) : (
                            <div className="flex items-center justify-center bg-slate-100 p-4 rounded-md shadow-md">
                                <h3 className="text-xl">Not following any Freelancers!</h3>
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

export default Followings;