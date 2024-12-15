import React,{ useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./components/header";
import axios from "axios";
import "./App.css"
interface Profile {}
const Profile : React.FC<Profile> = ({})=>{
    const [user, setUser] = useState<any>();
    const[following, setFollowing]=useState(0);
    const[followers, setFollowers]=useState(0);
    const[about,setAbout]=useState("")
    const[flag,setFlag]=useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        console.log(accessToken)
        if (!accessToken) {
            navigate("/login");
        } 

        const fetchUserData = async () => {
            try {
                console.log("ritu")
                const response = await axios.get("http://localhost:8000/api/v1/freelancer/current_freelancer", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const {freelancer} = response.data;
                setUser(freelancer);
                setFollowing(freelancer.following || 0);
                setFollowers(freelancer.followers || 0);
                setAbout(freelancer.about || "")    
            } catch (error) {
                console.error("error fetching user data",error);
                navigate("/login");
            }
        };
        fetchUserData();
    }, [navigate]);

    if(!user){
        return <div>Loading...</div>
    }
    // console.log(user.data.freelancer.fullname)
    // export const temp=(s:string)=>({
    //     setAbout({s})
    // })
  return(
    <>
        <Header></Header>
        <div className="h-[18vh] w-lvw bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 "></div>
        <div className="h-[75vh] w-lvw flex justify-between relative bg-slate-100">
            <div className="h-[80%] w-[10%]"></div>
            <div className="h-[90%] w-[20%] bg-yellow-400 z-10 translate-y-[-10%] flex flex-col justify-between items-center border-[2px] border-yellow-800 rounded-md">
                <div className="h-[35%] w-[100%] bg-yellow-300 flex flex-col justify-center items-center rounded-md">
                  <div className="h-[50%] w-[30%] rounded-full bg-yellow-400 border-[2px] border-yellow-800 flex justify-center items-center "><img src="../images/user.png" alt="" className="h-[80px] w-[80px]" /></div>
                  <p className="text-yellow-900">{user.data.freelancer.fullname}</p>
                  <p className="text-yellow-900">{user.data.freelancer.username}</p>
                </div>
                <div className="h-[70%] w-[100%] bg-yellow-300 rounded-md">
                    <div className="flex justify-between px-3">
                        <p className="text-yellow-900">Following</p>
                        <p>{following}</p>
                    </div>
                    <div className=" flex justify-center"><div className="h-[1.5px] w-[95%] bg-yellow-700"></div></div>
                    <div className="flex justify-between px-3 mt-3">
                        <p className="text-yellow-900">Followers</p>
                        <p>{followers}</p>
                    </div>
                    <div className=" flex justify-center"><div className="h-[1.5px] w-[95%] bg-yellow-700"></div></div>
                    <div className="mt-4 h-[75%] w-[100%] flex flex-col items-center ">
                        <div className="flex justify-between px-2 w-[100%] h-[15%]">
                            <p className="text-yellow-900">About</p>
                        </div>
                        <div className=" h-[40%] w-[90%] rounded-md">
                            <textarea id="myInput" readOnly value={about} className="focus:outline-none h-[100%] w-[100%] rounded-md p-2 bg-yellow-400 border-[2px] border-yellow-700 text-yellow-950"/>
                        </div>
                        <div className="flex justify-between px-2 w-[100%] h-[20%] mt-3">
                            <p className="text-yellow-900">Skills</p>   
                        </div>
                        <div className=" h-[40%] w-[90%] rounded-md">
                            <textarea id="myInput" readOnly className="focus:outline-none h-[100%] w-[100%] rounded-md p-2 bg-yellow-400 border-[2px] border-yellow-700 text-yellow-950"/>
                        </div>
                        <div className="w-[30%] h-[20%] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 border-[2px] border-yellow-800 mt-2 rounded-md flex justify-center items-center"> <Link to="/edit">Edit profile</Link></div>

                    </div>
                </div>
            </div>
            <div className=" h-[97%] w-[65%] bg-slate-100 overflow-auto px-4 py-2 my-2 rounded-md">
                <p className=" pt-2 text-xl font-sans text-">Stats</p>
                <div className="h-[20%] w-[100%]  flex justify-evenly">
                    <div className="stat h-[100%] w-[25%] bg-yellow-200 rounded-md ">

                    </div>
                    <div className="stat h-[100%] w-[25%] bg-yellow-200 rounded-md ">

                    </div>
                    <div className="stat h-[100%] w-[25%] bg-yellow-200 rounded-md ">
                    </div>
                </div>
                <div className=" h-[60%] w-[100%]  mt-4">
                    <p className=" text-xl font-sans pb-1">Paid projects</p>
                    <div className="h-[91%] w-[100%] flex justify-center items-center">
                        <div className="no-scrollbar h-[100%] w-[97%] bg-gray-400 border-[1px] border-[black] rounded-md">
                            
                        </div>

                    </div>
                </div>
                <div className=" h-[60%] w-[100%]  mt-4">
                    <p className=" text-xl font-sans pb-1">Unpaid projects</p>
                    <div className="h-[91%] w-[100%] flex justify-center items-center">
                        <div className="no-scrollbar h-[100%] w-[97%] bg-gray-400 border-[1px] border-[black] rounded-md">
                            
                        </div>

                    </div>
                </div>
                <div className="h-[5%]"></div>

            </div>
        </div>
    </>
  )
}
export default Profile