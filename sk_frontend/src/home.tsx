import { Link } from "react-router-dom";
import Footer from "./components/footer";

interface HomePage {}
const HomePage: React.FC<HomePage> = () => {
    return (

        <body className="bg-[url('/images/background.jpg')] bg-cover bg-center">  
        <div className="container h-screen w-screen flex flex-col items-center bg-transparent text-[#1e3a8a]">
            <header className="w-full h-[10vh] flex justify-between items-center px-8 shadow-md bg-blue-500 text-white">
                <h1 className="text-2xl font-bold">Skillcase</h1>
                <nav className="flex gap-6">
                    {/* <Link to="/" className="hover:underline">About Us</Link>
                    <Link to="/" className="hover:underline">Contact Us</Link> */}
                    <p className="font-bold text-white text-lg">Welcome to the world of Client-Freelancing!</p>

                </nav>
            </header>

            <main className="flex-grow w-[90%] max-w-[1200px] py-10 flex flex-col items-center text-center bg-transparent backdrop-blur-sm">
                <h2 className="text-4xl font-bold mb-6">Welcome to Skillcase</h2>
                <p className="text-lg mb-8">
                    Your go-to platform for connecting with top freelancers and finding the perfect project opportunities.
                </p>
                <div className="flex gap-4">
                    <Link
                        to="/projects"
                        className="px-6 py-3  bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                    >
                        Explore Projects
                    </Link>
                    <Link
                        to="/connector"
                        className="px-6 py-3 bg-white border border-blue-500 text-blue-500 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition-colors duration-300"
                    >
                        Create Profile
                    </Link>
                   
                </div>
                    <p className="text-lg mt-5">Already have an account?{" "}</p>
                    <div className="flex gap-4">
                    <Link to="/freelancer/login" className="px-4 py-2 mt-5 bg-white border border-blue-500 text-blue-500 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition-colors duration-300"
                        >
                            Sign In as Freelancer
                    </Link>
                    <Link to="/client/login" className="px-6 py-2 mt-5 bg-white border border-blue-500 text-blue-500 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition-colors duration-300"
                        >
                            Sign In as Client
                    </Link>
                    </div>
                        
            </main>

            <section className="w-full  py-10 shadow-md bg-transparent backdrop-blur-sm">
                <div className="w-[90%] max-w-[1200px] mx-auto text-center">
                    <h3 className="text-2xl font-semibold mb-4">Why Choose Skillcase?</h3>
                    <p className="text-sm mb-6">
                        At Skillcase, we believe in empowering freelancers and clients to achieve success together. Here's how:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="feature bg-blue-100 p-6 rounded-lg shadow-md">
                            <h4 className="text-lg font-bold mb-2">Wide Range of Opportunities</h4>
                            <p className="text-sm">From tech to design, find projects tailored to your skills.</p>
                        </div>
                        <div className="feature bg-blue-100 p-6 rounded-lg shadow-md">
                            <h4 className="text-lg font-bold mb-2">Trusted Clients</h4>
                            <p className="text-sm">Work with reputable clients who value your expertise.</p>
                        </div>
                        <div className="feature bg-blue-100 p-6 rounded-lg shadow-md">
                            <h4 className="text-lg font-bold mb-2">Secure Payments</h4>
                            <p className="text-sm">Get paid securely and on time for every project you complete.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* <footer className="w-full h-[8vh] flex justify-center items-center bg-[#1e3a8a] text-white">
                <p className="text-sm">&copy; 2025 Skillcase. All rights reserved.</p>
            </footer> */}
            <Footer />
        </div>
        </body>

    );
};

export default HomePage;
