import { Link } from "react-router-dom";
import Footer from "./components/footer";

interface HomePage {}
const HomePage: React.FC<HomePage> = () => {
    return (
        <body className="bg-[url('/images/background.jpg')] bg-cover bg-center bg-fixed">
  <div className="container min-h-screen w-full flex flex-col items-center bg-transparent text-[#1e3a8a]">
    {/* Header */}
    <header className="w-full h-16 sm:h-[10vh] flex justify-between items-center px-4 sm:px-8 shadow-md bg-blue-500 text-white">
      <h1 className="text-xl sm:text-2xl font-bold">Skillcase</h1>
      <nav className="hidden sm:flex gap-4 sm:gap-6">
        <p className="font-bold text-white text-sm sm:text-lg">Welcome to the world of Client-Freelancing!</p>
      </nav>
      <div className="sm:hidden">
        {/* Mobile menu button would go here */}
      </div>
    </header>

    {/* Main Hero Section */}
    <main className="flex-grow w-[90%] max-w-[1200px] py-6 sm:py-10 flex flex-col items-center text-center bg-transparent backdrop-blur-sm px-4">
      <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Welcome to Skillcase</h2>
      <p className="text-base sm:text-lg mb-6 sm:mb-8">
        Your go-to platform for connecting with top freelancers and finding the perfect project opportunities.
      </p>
      
      {/* Primary CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
        <Link
          to="/projects"
          className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 text-sm sm:text-base"
        >
          Explore Projects
        </Link>
        <Link
          to="register/connector"
          className="px-4 py-2 sm:px-6 sm:py-3 bg-white border border-blue-500 text-blue-500 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition-colors duration-300 text-sm sm:text-base"
        >
          Create Profile
        </Link>
      </div>
      
      {/* Secondary CTA */}
      <p className="text-base sm:text-lg mt-4 sm:mt-5">Already have an account?</p>
      <div className="flex gap-3 sm:gap-4">
        <Link 
          to="/login/connector" 
          className="px-3 py-1 sm:px-4 sm:py-2 mt-3 sm:mt-5 bg-white border border-blue-500 text-blue-500 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition-colors duration-300 text-sm sm:text-base"
        >
          Sign In
        </Link>
      </div>
    </main>

    {/* Features Section */}
    <section className="w-full py-6 sm:py-10 shadow-md bg-transparent backdrop-blur-sm px-4">
      <div className="w-[90%] max-w-[1200px] mx-auto text-center">
        <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Why Choose Skillcase?</h3>
        <p className="text-xs sm:text-sm mb-4 sm:mb-6">
          At Skillcase, we believe in empowering freelancers and clients to achieve success together. Here's how:
        </p>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="feature bg-blue-100 p-4 sm:p-6 rounded-lg shadow-md">
            <h4 className="text-base sm:text-lg font-bold mb-2">Wide Range of Opportunities</h4>
            <p className="text-xs sm:text-sm">From tech to design, find projects tailored to your skills.</p>
          </div>
          <div className="feature bg-blue-100 p-4 sm:p-6 rounded-lg shadow-md">
            <h4 className="text-base sm:text-lg font-bold mb-2">Trusted Clients</h4>
            <p className="text-xs sm:text-sm">Work with reputable clients who value your expertise.</p>
          </div>
          <div className="feature bg-blue-100 p-4 sm:p-6 rounded-lg shadow-md">
            <h4 className="text-base sm:text-lg font-bold mb-2">Secure Payments</h4>
            <p className="text-xs sm:text-sm">Get paid securely and on time for every project you complete.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Footer - Assuming your Footer component is already responsive */}
    <Footer />
  </div>
</body>

    );
};

export default HomePage;
