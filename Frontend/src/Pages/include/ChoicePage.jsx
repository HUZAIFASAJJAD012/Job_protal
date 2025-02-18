import React from 'react';
import {useNavigate} from "react-router-dom";

const ChoicePage = () => {
    const navigate = useNavigate()
    const handleJobseekerLoginClick = (type) => {
        navigate("/login")
    };
    const handleHireLoginClick = (type) => {
        navigate("/school-login")
    };
    const handleRegisterJobSeekerClick = (type) => {
        navigate("/user-registration")
    };
    const handleRegisterHireClick = (type) => {
        navigate("/school-registration")
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-[#f7fcfc] p-10">
                {/* LoginChoice Section */}
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-[#333333] mb-6">
                        Login as
                    </h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleJobseekerLoginClick('jobseeker')}
                            className="flex-1 bg-[#2b8200] text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                        >
                            Job Seeker
                        </button>
                        <button
                            onClick={() => handleHireLoginClick('employer')}
                            className="flex-1 bg-[#2b8200] text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                        >
                            I want to Hire
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center my-8">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-[#AAAAAA]">or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Register Section */}
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-[#333333] mb-6">
                        Register as
                    </h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleRegisterJobSeekerClick('jobseeker')}
                            className="flex-1 bg-[#c0dab3] text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                        >
                            Job Seeker
                        </button>
                        <button
                            onClick={() => handleRegisterHireClick('employer')}
                            className="flex-1 bg-white text-[#333333] py-3 px-6 rounded-lg border border-[#333333] hover:bg-gray-50 transition-colors font-medium"
                        >
                            I want to Hire
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChoicePage;