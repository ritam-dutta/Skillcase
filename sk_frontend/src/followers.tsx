import Header from "./components/header";
import Loader from "./components/loader";
import Footer from "./components/footer";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
interface Followers {}
const Followers: React.FC<Followers> = ({}) => {

    const [loading, setLoading] = useState(false);
    const [followers, setFollowers] = useState([]);
    const {username} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFollowers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/client/getfollowers/${username}`);
                const fetchedFollowers = response.data.data.followers;
                setFollowers(fetchedFollowers);
                // setProject(project);
                // setTitle(project.title);
                // setDescription(project.description);
                // setIndustry(project.industry);
                // setBudget(project.budget);
                // setDuration(project.duration);
                // setUsername(project.employer);
                // setStatus(project.status);
                // console.log("Projects:", project);
            } catch (error) {
                console.error("Fetch Projects Error:", error);
            }
            setLoading(false);
        };
        fetchFollowers();
    }, []);

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
                        {followers.length > 0 ? followers.map(follower => (
                            <div key={follower._id} className="flex items-center justify-between bg-slate-100 p-4 rounded-md shadow-md">
                                <div className="flex items-center gap-4"> 
                                    <div className="rounded-full bg-gray-300 p-2">
                                        <img src="/images/user.png" alt=""  className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <Link to={`/client/profile/${follower}`} className="text-xl">@{follower}</Link>
                                    </div>
                                </div>
                                <div>
                                    <button
                                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={() => navigate(`/client/profile/${follower}`)}
                                    >
                                    View Profile
                                    </button>
                                </div>
                            </div>
                        )
                        ) : (
                            <div className="flex items-center justify-center bg-slate-100 p-4 rounded-md shadow-md">
                                <h3 className="text-xl font-bold">No Followers Yet</h3>
                            </div>
                    )}
                    </div>

                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-10 justify-center items-center">
                        
                        <button
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => navigate(`/client/profile/${username}`)}
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

export default Followers;