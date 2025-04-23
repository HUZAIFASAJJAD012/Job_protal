import { useEffect, useState } from "react";
import api from "../../Utils/Axios";
import Sidebar from "./Sidebar";

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;

    // Fetch jobs data
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/school/get/job"); // Update with your API URL
                const jobsData = response.data || []; // Adjust structure if needed
                setJobs(jobsData);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobs();
    }, []);

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar/>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Job List</h1>

                {/* Job Table */}
                <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
                    <table className="min-w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-200 text-xs text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-700">Job Title</th>
                                <th className="px-6 py-3 font-semibold text-gray-700">School</th>
                                <th className="px-6 py-3 font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-3 font-semibold text-gray-700">Pay Per Day</th>
                                <th className="px-6 py-3 font-semibold text-gray-700">Cover Dates</th>
                                <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentJobs.map((job, index) => (
                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50 transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-800">{job.title}</td>
                                    <td className="px-6 py-4 text-gray-700">{job.schoolName}</td>
                                    <td className="px-6 py-4 text-gray-700">{job.location || "N/A"}</td>
                                    <td className="px-6 py-4 text-gray-700">${job.payPerDay || "Not Available"}</td>
                                    <td className="px-6 py-4 text-gray-700">
                                        {new Date(job.coverFrom).toLocaleDateString()} - {new Date(job.coverTo).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-4">
                                        <button className="text-red-600 hover:text-blue-800 transition duration-300 ease-in-out transform hover:scale-105">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-6">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-lg font-semibold text-gray-700">
                            {`Page ${currentPage} of ${totalPages}`}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    {/* Go to First & Last Buttons */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50"
                        >
                            First
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50"
                        >
                            Last
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobList;
