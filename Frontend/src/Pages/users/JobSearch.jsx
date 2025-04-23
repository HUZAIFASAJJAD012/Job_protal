"use client";

import {useEffect, useState} from "react";
import {Button} from "../../components/ui/button";
import {Input} from "../../components/ui/input";
import {Bookmark} from "lucide-react";
import Header from "../users/Header";
import {Link} from "react-router-dom";
import api from "../../Utils/Axios";

// Job Card Component
function JobCard({
                     _id,
                     title,
                     schoolName,
                     coverFrom,
                     coverTo,
                     payPerDay,
                     payPerHour,
                     currency,
                     description,
                     paymentMethod,
                     location,
                     qualifications,
                     backgroundChecks,
                     jobDurationDays,
                     jobDurationType,
                     timeStart,
                     timeEnd
                 }) {
    return (
        <div className="bg-white rounded p-6 mb-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-4 relative pr-48">
                <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-01%20202231-FVjv9TGizfnSdARH7nPOukiU2MkI2b.png" // Placeholder for school logo
                    alt="Building"
                    width={64}
                    height={64}
                    className="rounded-full"
                />
                <div className="flex-1 pr-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-base font-semibold mb-0.5">{title}</h3>
                            <p className="text-gray-500 text-sm mb-1">Cover: {coverFrom}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-6 w-6"
                        >
                            <Bookmark className="h-5 w-5 stroke-black fill-white"/>
                        </Button>
                    </div>
                    <div className="space-y-0.5 text-gray-500 text-sm">
                        <p>Start: {timeStart} End: {timeEnd}</p>
                        <p>Time: {jobDurationDays} Pay: {payPerDay}</p>
                    </div>
                </div>
                <Button
                    className="bg-[#2b7a0b] text-white text-md hover:bg-[#236508] py-4 px-9 absolute bottom-0 right-0">
                    Apply Now
                </Button>
            </div>
        </div>
    );
}

export default function JobSearch() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [filters, setFilters] = useState({
        location: "",
        dailyRate: "",
        title: "",
    });

    // Fetch jobs using axios
    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await api.get("/school/get/job"); // Replace with your API endpoint
                setJobs(response.data);
                setFilteredJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        }

        fetchJobs();
    }, []);

    // Filter jobs dynamically
    const handleFilterChange = (key, value) => {
        setFilters((prevFilters) => ({...prevFilters, [key]: value}));

        const filtered = jobs.filter((job) => {
            const matchesLocation = job.location
                ? job.location.toLowerCase().includes(filters.location.toLowerCase())
                : true;
            const matchesTitle = job.title
                ? job.title.toLowerCase().includes(filters.title.toLowerCase())
                : true;
            const matchesDailyRate = filters.dailyRate
                ? job.payPerDay >= Number(filters.dailyRate)
                : true;

            return matchesLocation && matchesTitle && matchesDailyRate;
        });

        setFilteredJobs(filtered);
    };

    return (
        <>
            <Header/>
            <div className="w-full max-w-5xl mx-auto px-4 py-4">
                <h1 className="text-lg font-semibold mb-6">Job Search</h1>

                {/* Search Form */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="location" className="text-sm text-gray-600 mb-1.5 block">
                                Location
                            </label>
                            <Input
                                id="location"
                                type="text"
                                className="w-full h-11 text-base px-3 border-gray-200 focus:border-gray-300 focus:ring-0"
                                placeholder="Enter location"
                                value={filters.location}
                                onChange={(e) => handleFilterChange("location", e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="title" className="text-sm text-gray-600 mb-1.5 block">
                                Title
                            </label>
                            <Input
                                id="title"
                                type="text"
                                className="w-full h-11 text-base px-3 border-gray-200 focus:border-gray-300 focus:ring-0"
                                placeholder="Enter title"
                                value={filters.title}
                                onChange={(e) => handleFilterChange("title", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="dailyRate" className="text-sm text-gray-600 mb-1.5 block">
                                Daily Rate
                            </label>
                            <Input
                                id="dailyRate"
                                type="text"
                                className="w-full h-11 text-base px-3 border-gray-200 focus:border-gray-300 focus:ring-0"
                                placeholder="Enter minimum daily rate"
                                value={filters.dailyRate}
                                onChange={(e) => handleFilterChange("dailyRate", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Search Results */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Search Jobs</h2>
                    <div>
                        {filteredJobs.map((job, index) => (
                            <Link to={{
                                pathname: `/user/job-detail`,
                            }}
                                  state={{
                                      job: job
                                  }}>
                                <JobCard {...job} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
