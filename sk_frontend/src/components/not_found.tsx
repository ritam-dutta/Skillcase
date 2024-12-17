import { Link } from "react-router-dom"
import "../App.css"

interface Login {}
const Not_found : React.FC<Login> = ({})=>{
  return(
    <>
    <div className=" h-lvh w-lvw bg-blue-200 ">
        <h1 className="text-red-600 p-2">Error</h1>
        <p className="p-2 font-bold">OOPS! Wrong URL. Click on Skillcase to reach our website</p>
        <div className="flex gap-4 p-2">
            <Link to="/login" className="hover:text-red-700">Skillcase</Link>
            {/* <Link to="/register" className="hover:text-red-700">Register</Link> */}
        </div>
    </div>
    </>
  )
}

export default Not_found