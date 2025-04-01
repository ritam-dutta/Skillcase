import { Link } from "react-router-dom"
import "./App.css"
import Footer from "./components/footer"
interface Connector {}
const Connector : React.FC<Connector> = ({})=>{
  const url = window.location.href;
  let nextTab = url.includes("register") ? "register" : "login";
  return(
    <>
      <div className="min-h-screen w-full bg-[url('/images/background.jpg')] bg-cover bg-center bg-fixed flex flex-col justify-between items-center">
  {/* Navbar */}
  <header className="w-full h-16 md:h-[8vh] flex justify-between items-center px-4 md:px-8 shadow-md bg-gradient-to-r from-blue-400 to-blue-600 text-white">
    <h1 className="text-xl md:text-2xl font-bold">Skillcase</h1>
    <nav className="hidden sm:flex gap-4 md:gap-6">
      <p className="font-bold text-white text-sm md:text-lg">Welcome to the world of Client-Freelancing!</p>
    </nav>
    <div className="sm:hidden">
      {/* Mobile menu button would go here */}
    </div>
  </header>

  {/* Main Content */}
  <div className="main w-full flex-grow flex justify-center items-center p-4">
    <div className="card bg-slate-50 shadow-lg rounded-lg w-full sm:w-[90%] max-w-[800px] py-6 sm:py-8 px-4 sm:px-6 flex flex-col items-center border border-gray-200">
      {/* Header */}
      <div className="header w-full flex items-center justify-center mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/images/plus.png" alt="Icon" className="h-8 w-8 sm:h-10 sm:w-10" />
          <p className="text-xl sm:text-2xl font-semibold text-gray-700">Continue as a</p>
        </div>
      </div>

      {/* Options */}
      <div className="options flex flex-col sm:flex-row justify-center sm:justify-evenly w-full gap-6 sm:gap-0">
        {/* Client Option */}
        <div className="option flex flex-col items-center w-full sm:w-[40%] hover:scale-105 transition-transform duration-300">
          <Link 
            to={`/client/${nextTab}`} 
            className="icon bg-blue-100 rounded-full h-24 w-24 sm:h-[120px] sm:w-[120px] flex items-center justify-center mb-3 sm:mb-4 shadow-md"
          >
            <img src="/images/client.png" alt="Client" className="h-16 w-16 sm:h-[80px] sm:w-[80px]" />
          </Link>
          <Link
            to={`/client/${nextTab}`}
            className="text-base sm:text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            Client
          </Link>
        </div>

        {/* Freelancer Option */}
        <div className="option flex flex-col items-center w-full sm:w-[40%] hover:scale-105 transition-transform duration-300">
          <Link 
            to={`/freelancer/${nextTab}`} 
            className="icon bg-blue-100 rounded-full h-24 w-24 sm:h-[120px] sm:w-[120px] flex items-center justify-center mb-3 sm:mb-4 shadow-md"
          >
            <img src="/images/freelancer.png" alt="Freelancer" className="h-16 w-16 sm:h-[80px] sm:w-[80px]" />
          </Link>
          <Link
            to={`/freelancer/${nextTab}`}
            className="text-base sm:text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
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