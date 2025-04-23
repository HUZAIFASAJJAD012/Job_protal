import { Helmet } from "react-helmet";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import JobsNearBy from "./include/Jobs-Near-By";
import WhyChooseUs from "./include/Why-Choose-Should-Us";
import Blog from "./Blog";
import Pricing from "./Pricing";
import ContactPage from "./Contact";
import AboutUs from "./About";
import api from "../Utils/Axios";

function Home() {
    const [jobsAvailable, setJobsAvailable] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");

    const images = [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-21%20234547-10D5DLrL80fLYA5En2D0XV5JInFFWv.png",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-2dfghj1%20233633-75NU2ISPfLci9YYZAce7BBY7VJW08j.png",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-nhjg12-21%20233633-SOmVJHPUX1XSGlDIKGrwN7OWn9ovqr.png"
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/school/get/job");
                const jobs = response.data || [];
                setJobsAvailable(jobs);
                setFilteredJobs(jobs); // Initialize with all jobs
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobs();

        // Automatically change the image every 5 seconds
        const imageChangeInterval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        // Clear the interval when the component unmounts
        return () => clearInterval(imageChangeInterval);
    }, []);

    const handleSearch = () => {
        const lowerKeyword = keyword.toLowerCase();
        const lowerLocation = location.toLowerCase();

        const filtered = jobsAvailable.filter((job) => {
            const matchKeyword = job.title.toLowerCase().includes(lowerKeyword) ||
                job.description?.toLowerCase().includes(lowerKeyword);
            const matchLocation = job.location?.toLowerCase().includes(lowerLocation);

            return matchKeyword && matchLocation;
        });

        setFilteredJobs(filtered);
    };

    return (
        <>
            <Helmet><title>Home</title></Helmet>
            <div className="relative h-[calc(100vh-80px)] min-h-[600px]">
                {/* Slider */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                    style={{
                        backgroundImage: `url(${images[currentIndex]})`,
                        filter: "brightness(0.7)",
                    }}
                />
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center px-4">
                    <button onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <ChevronLeft className="w-6 h-6 text-gray-600"/>
                    </button>
                    <button onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <ChevronRight className="w-6 h-6 text-gray-600"/>
                    </button>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 text-center">
                        Search Temp Cover Jobs
                    </h1>

                    <div
                        className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-[10px] p-8 border border-rgb(250 250 205) shadow-lg">
                        <div className="flex flex-col md:flex-row md:space-x-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-white text-sm mb-1 block">Search Keyword</label>
                                <input
                                    type="text"
                                    placeholder="Your Keyword"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-md bg-white border-0 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-white text-sm mb-1 block">Location</label>
                                <input
                                    type="text"
                                    placeholder="Your Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-md bg-white border-0 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="md:self-end md:-ml-2 bg-[#2B7A0B] text-white p-2.5 rounded-md hover:bg-[#236508] transition-colors"
                            >
                                <Search className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <JobsNearBy jobs={filteredJobs}/>
            <WhyChooseUs/>
            <Blog/>
            <div id="pricing"><Pricing/></div>
            <div id="about-us"><AboutUs/></div>
            <div id="contact-us">
                <div className="bg-gray-300 h-[2px] w-full" style={{marginTop: "130px"}}></div>
                <ContactPage/>
            </div>
        </>
    );
}

export default Home;
