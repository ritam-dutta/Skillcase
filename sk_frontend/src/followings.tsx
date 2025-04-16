import Header from "./components/header";
import { Skeleton } from "./components/ui/skeleton";
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
    // const [followings, setFollowings] = useState([]);
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
                // setFollowings(fetchedFollowings);
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
<div className="h-[92vh] w-screen bg-gray-200 dark:bg-slate-600 flex flex-col justify-between">
  {/* Title Section */}
  <div className="h-[15vh] w-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-800 dark:to-slate-900 flex items-center px-4 sm:px-8">
    <h1 className="text-3xl sm:text-4xl text-white font-bold dark:text-gray-100">Followings</h1>
  </div>

  {/* Main Content */}
  <main className="h-[72vh] flex-grow w-full flex justify-center items-start py-6 px-4 sm:px-8">
    {!loading ? (
      <div className="w-full sm:w-11/12 lg:w-3/5 bg-slate-50 dark:bg-slate-900 shadow-lg rounded-lg p-6 sm:p-8 mt-4 lg:mt-[-13vh]">
        {/* Form Content */}
        <div className="space-y-6">
          {/* Description */}
          <div>
            {isAlreadyFollowing ? (
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md shadow-md flex flex-col items-center justify-center gap-4 mb-5">
                <p className="font-bold dark:text-200">You both follow each other</p>
                <div className="flex justify-between w-full -mt-4">
                  <div className="flex gap-4 items-center">
                    <div className="rounded-full bg-gray-300 dark:bg-gray-400 p-2">
                      <img src="/images/user.png" alt="" className="h-5 w-5" />
                    </div>
                    <div>
                      <Link
                        to={`/${alreadyFollowingUser?.role}/profile/${alreadyFollowingUser?.username}`}
                        className="text-xl dark:text-gray-200"
                      >
                        @{alreadyFollowingUser?.username}
                      </Link>
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
            ) : null}

            <div>
              <div className="flex items-center justify-center">
                <p className="font-bold dark:text-gray-200">Clients</p>
              </div>
              {clientFollowings.length > 0 ? (
                clientFollowings.map((following) => (
                  <div key={following._id} className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-4 shadow-md mb-4 rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-gray-300 dark:bg-gray-400 p-2">
                        <img src="/images/user.png" alt="" className="h-5 w-5" />
                      </div>
                      <div>
                        <Link to={`/client/profile/${following.username}`} className="text-xl dark:text-gray-200">
                          @{following.username}
                        </Link>
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
                ))
              ) : (
                <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 p-4 rounded-md shadow-md">
                  <h3 className="text-xl dark:text-gray-200">Not following any Clients!</h3>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-center">
                <p className="font-bold mb-2 dark:text-gray-200">Freelancers</p>
              </div>
              {freelancerFollowings.length > 0 ? (
                freelancerFollowings.map((follower) => (
                  <div key={follower._id} className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-4 shadow-md mb-4 rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-gray-300 dark:bg-gray-400 p-2">
                        <img src="/images/user.png" alt="" className="h-5 w-5" />
                      </div>
                      <div>
                        <Link to={`/${follower.role}/profile/${follower.username}`} className="text-xl">
                          @{follower.username}
                        </Link>
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
                ))
              ) : (
                <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 dark:border-gray-600 p-4 rounded-md shadow-md">
                  <h3 className="text-xl dark:text-gray-200">Not following any Freelancers!</h3>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-6 sm:gap-10 justify-center items-center">
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => navigate(`/${currentRole}/profile/${username}`)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="w-11/12 sm:w-10/12 md:w-8/12 lg:w-3/5 bg-slate-50 dark:bg-slate-800 shadow-lg rounded-lg p-8 mt-[-13vh] sm:mt-[-5vh]">
                <div className="space-y-6">
                    <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md shadow-md flex flex-col items-center justify-center gap-4 mb-5">
                        <Skeleton className="h-4 w-40 dark:bg-slate-700" />
                        <div className="flex justify-between w-full -mt-4">
                            <div className="flex gap-4 items-center"> 
                                <Skeleton className="rounded-full h-10 w-10 dark:bg-slate-700" />
                                <Skeleton className="h-4 w-24 dark:bg-slate-700" />
                            </div>
                            <Skeleton className="h-10 w-28 dark:bg-slate-700" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <Skeleton className="h-4 w-20 dark:bg-slate-700" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900 p-4 shadow-md rounded-md mt-1 flex justify-between">
                        <div className="flex items-center gap-4"> 
                            <Skeleton className="rounded-full h-10 w-10 dark:bg-slate-700" />
                            <Skeleton className="h-4 w-24 dark:bg-slate-700" />
                        </div>
                        <Skeleton className="h-10 w-28 dark:bg-slate-700" />
                    </div>
                    <div className="flex items-center justify-center mt-6">
                        <Skeleton className="h-4 w-24 dark:bg-slate-700" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900 p-4 shadow-md rounded-md mt-1 flex justify-between">
                        <div className="flex items-center gap-4"> 
                            <Skeleton className="rounded-full h-10 w-10 dark:bg-slate-700" />
                            <Skeleton className="h-4 w-24 dark:bg-slate-700" />
                        </div>
                        <Skeleton className="h-10 w-28 dark:bg-slate-700" />
                    </div>
                    <div className="mt-6 flex gap-10 justify-center items-center">
                        <Skeleton className="h-10 w-32 dark:bg-slate-700" />
                    </div>
                </div>
            </div>
    )}
  </main>
</div>
        </>
    );
}

export default Followings;