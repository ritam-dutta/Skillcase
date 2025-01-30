import { Link } from "react-router-dom"
import "./App.css"
import Footer from "./components/footer"
interface Connector {}
const Connector : React.FC<Connector> = ({})=>{
  const url = window.location.href;
  let nextTab = url.includes("register") ? "register" : "login";
  return(
    <>
      <div className="h-screen w-screen bg-[url('/images/background.jpg')] bg-cover bg-center flex flex-col justify-between items-center">
  {/* Navbar */}
  <header className="w-full h-[8vh] flex justify-between items-center px-8 shadow-md bg-gradient-to-r from-blue-400 to-blue-600 text-white">
                <h1 className="text-2xl font-bold">Skillcase</h1>
                <nav className="flex gap-6">
                    {/* <Link to="/" className="hover:underline">About Us</Link>
                    <Link to="/" className="hover:underline">Contact Us</Link> */}
                    <p className="font-bold text-white text-lg">Welcome to the world of Client-Freelancing!</p>
                </nav>
            </header>

  {/* Main Content */}
  <div className="main w-full flex justify-center items-center">
    <div className="card bg-slate-50 shadow-lg rounded-lg w-[90%] max-w-[800px] py-8 px-6 flex flex-col items-center border border-gray-200">
      {/* Header */}
      <div className="header w-full flex items-center justify-center mb-8">
        <div className="flex items-center gap-3">
          <img src="/images/plus.png" alt="Icon" className="h-10 w-10" />
          <p className="text-2xl font-semibold text-gray-700">Continue as a</p>
        </div>
      </div>

      {/* Options */}
      <div className="options flex justify-evenly w-full">
        {/* Client Option */}
        <div className="option flex flex-col items-center w-[40%] hover:scale-105 transition-transform duration-300">
          <Link to={`/client/${nextTab}`} className="icon bg-blue-100 rounded-full h-[120px] w-[120px] flex items-center justify-center mb-4 shadow-md">
            <img src="/images/client.png" alt="Client" className="h-[80px] w-[80px] " />
          </Link>
          <Link
            to={`/client/${nextTab}`}
            className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            Client
          </Link>
        </div>

        {/* Freelancer Option */}
        <div className="option flex flex-col items-center w-[40%] hover:scale-105 transition-transform duration-300">
          <Link to={`/freelancer/${nextTab}`} className="icon bg-blue-100 rounded-full h-[120px] w-[120px] flex items-center justify-center mb-4 shadow-md">
            <img src="/images/freelancer.png" alt="Freelancer" className="h-[80px] w-[80px]" />
          </Link>
          <Link
            to={`/freelancer/${nextTab}`}
            className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            Freelancer
          </Link>
        </div>
      </div>
    </div>
  </div>

  {/* Footer */}
  <Footer />
</div>

    </>
  )
}

export default Connector