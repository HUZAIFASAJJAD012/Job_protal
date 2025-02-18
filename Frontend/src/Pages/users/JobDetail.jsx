import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import Header from "./Header";
import { Store } from "../../Utils/Store";
import api from "../../Utils/Axios";
import {toast} from "react-toastify";

const JobDetail = () => {
    const { state } = useContext(Store);
    const { UserInfo } = state;
    const location = useLocation();
    const [job, setJob] = useState(location.state?.job || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    if (loading) {
        return <p>Loading job details...</p>;
    }

    if (!job) {
        return <p>Job details not found.</p>;
    }

    // Handle Apply Job
    const handleApplyJob = async (e) => {
        e.preventDefault()
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Make Axios request to apply for the job
            const response = await api.post('/user/apply-job', {
                user_id: UserInfo.id, // Send the user ID from context
                job_id: job._id, // Send the job ID
            });

                setSuccess(true);
                toast.success("Applied SuccessFully")

        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen flex-col bg-gray-50">
            {/* Navigation */}
            <Header />
            {/* Main Content */}
            <main className="flex-1 overflow-auto p-6">
                <div className="mx-auto max-w-4xl space-y-8">
                    {/* Job Header Card */}
                    <Card className="bg-[#f7fcfc] p-4 shadow-sm border-gray-200" style={{ width: "100%" }}>
                        <div className="flex gap-4">
                            <div className="h-16 w-16 flex-shrink-0">
                                <Avatar>
                                    <AvatarImage
                                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-01%20202231-FVjv9TGizfnSdARH7nPOukiU2MkI2b.png" // Placeholder for school logo
                                        alt={job.schoolName}
                                    />
                                    <AvatarFallback>{job.schoolName[0]}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-xl font-semibold">{job.schoolName}</h1>
                                <p className="text-gray-600">{job.title}</p>
                                <p className="font-medium">Cover: {job.jobDurationDays || "N/A"} days</p>
                                <p className="text-sm text-gray-500">{job.jobDurationType || "N/A"}</p>
                                <p className="font-medium">
                                    {job.currency} {job.payPerHour ? `${job.payPerHour}/hr` : `${job.payPerDay}/day`}
                                </p>
                            </div>
                        </div>
                    </Card>
  {/* Success/Error Messages */}
                    {success && <p className="text-green-500 text-center">You have successfully applied for this job!</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {/* Details Card */}
                    <Card className="bg-[#f7fcfc] p-4 border-gray-200">
                        {/* Date and Time Details */}
                        <div className="grid grid-cols-4 text-sm">
                            <div>
                                <p>Start Date: {new Date(job.coverFrom).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p>End Date: {new Date(job.coverTo).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p>Start Time: {job.timeStart || "N/A"}</p>
                            </div>
                            <div>
                                <p>End Time: {job.timeEnd || "N/A"}</p>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="mt-4 space-y-1">
                            <p className="font-medium">
                                Pay: {job.currency} {job.payPerDay || "N/A"} / day
                            </p>
                            <p className="text-sm text-gray-600">Payment Method: {job.paymentMethod || "N/A"}</p>
                        </div>

                        {/* Qualifications */}
                        <div className="mt-4 space-y-2">
                            <h2 className="text-lg font-semibold">Qualifications</h2>
                            <div className="space-y-1">
                                {job.qualifications?.length > 0 ? (
                                    job.qualifications.map((qual, index) => (
                                        <p className="text-gray-600" key={index}>
                                            {qual}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-gray-600">No specific qualifications required</p>
                                )}
                            </div>
                        </div>

                        {/* Background Checks */}
                        <div className="mt-4 space-y-2">
                            <h2 className="text-lg font-semibold">Background Checks</h2>
                            <div className="space-y-1">
                                {job.backgroundChecks?.length > 0 ? (
                                    job.backgroundChecks.map((check, index) => (
                                        <p className="text-gray-600" key={index}>
                                            {check}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-gray-600">No background checks required</p>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Apply Button */}
                    <div className="flex justify-center">
                        <Button
                            className="w-[400px] bg-[#2B8A0E] hover:bg-[#247A0C] text-white py-2 rounded-md"
                            onClick={handleApplyJob} // Trigger job application on click
                            disabled={loading}
                        >
                            {loading ? 'Applying...' : 'Apply for the Job'}
                        </Button>
                    </div>



                    {/* Payment Options */}
                    <div className="space-y-4 pt-2">
                        <p className="text-center text-[#2B8A0E]">Pay 15.00 {job.currency}</p>
                        <div className="flex justify-center gap-4">
                            <Button
                                variant="outline"
                                className="flex w-[120px] items-center justify-center gap-2 rounded-md border border-[#C5BEBE] bg-white px-4 py-2 hover:bg-gray-50"
                            >
                                <img
                                    src="https://img.icons8.com/material-sharp/24/000000/mac-os.png"
                                    alt="Apple Pay"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                                <span className="text-black">Pay</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex w-[120px] items-center justify-center gap-2 rounded-md border border-[#C5BEBE] bg-white px-4 py-2 hover:bg-gray-50"
                            >
                                <img
                                    src="https://img.icons8.com/color/48/000000/google-logo.png"
                                    alt="Google Pay"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                                <span className="text-black">Pay</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JobDetail;
