import "../App.css"
import { Link } from "react-router-dom"
interface Footer {}
const Footer : React.FC<Footer> = ({})=>{

    return(
        <>
            <div className="footer h-[8vh] w-[100vw] flex flex-row justify-between">
            <div className="foot1 h-[100%] w-[30%] flex flex-row justify-center items-center"><p id="foot_text" className="font-sans font-bold text-xl text-[rgb(241,186,6)]">©SkillCase 2024 | Ritam Dutta</p></div>
            <div className="foot2 h-[100%] w-[30%] flex flex-row justify-evenly items-center">
                <div className=" group relative font-segoe-ui text-lg text-yellow-400">
                    <Link to="" className="foot_text2 font-sans text-[rgb(241,186,6)] text-[17px] relative hover:after:scale-x-[1] hover:after:scale-y-[1] ">Contact us</Link>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-400 cursor-pointer transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                </div>
                <div className=" group relative font-segoe-ui text-lg text-yellow-400">
                    <Link to="" className="foot_text2 font-sans text-[rgb(241,186,6)] text-[17px] relative hover:after:scale-x-[1] hover:after:scale-y-[1] ">About us</Link>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-400 cursor-pointer transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                </div>
                <div className=" group relative font-segoe-ui text-lg text-yellow-400">
                    <Link to="" className="foot_text2 font-sans text-[rgb(241,186,6)] text-[17px] relative hover:after:scale-x-[1] hover:after:scale-y-[1] ">Privacy</Link>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-400 cursor-pointer transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                </div>
            </div>
        </div>
        </>
    )

}

export default Footer