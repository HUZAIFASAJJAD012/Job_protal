import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import Header from "./Header";
import { Store } from "../../Utils/Store";
import api from "../../Utils/Axios";
import { toast } from "react-toastify";

const JobDetail = () => {
  const { state } = useContext(Store);
  const { UserInfo } = state;
  const location = useLocation();
  const [job, setJob] = useState(location.state?.job || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasApplied, setHasApplied] = useState(null); // null means loading state

  useEffect(() => {
    const checkIfApplied = async () => {
      if (!UserInfo || !job?._id) return;

      try {
        const response = await api.get("/school/get/applied-candidate", {
          params: {
            user_id: UserInfo.id,
            job_id: job._id,
          },
        });

        console.log("Check applied response:", response.data);

        // Ensure response.data is an array of application objects
        const applications = Array.isArray(response.data) ? response.data : [];

        // Check if current user has applied for the current job
        const applied = applications.some(
          (application) =>
            application.user === UserInfo.id && application.job === job._id
        );

        setHasApplied(applied);
      } catch (err) {
        console.error("Failed to check job application status:", err);
        setHasApplied(false); // fallback to allow showing the button
      }
    };

    checkIfApplied();
  }, [UserInfo, job]);

  const handleApplyJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post("/api/payment/job-application", {
        user_id: UserInfo.id,
        job_id: job._id,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading UI if data not ready
  if (!UserInfo || !job || hasApplied === null) {
    return <p className="text-center mt-10">Loading job details...</p>;
  }

  const jobImageUrl = job.jobImage
    ? `http://localhost:8000${job.jobImage}`
    : job.image
    ? job.image
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        job.schoolName || "School"
      )}&background=random`;

  const isJobExpired = job.coverTo && new Date(job.coverTo) < new Date();
  const isButtonVisible = !hasApplied && !isJobExpired && job.status !== "closed";

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <Card
            className="bg-[#f7fcfc] p-4 shadow-sm border-gray-200"
            style={{ width: "100%" }}
          >
            <div className="flex gap-4">
              <div className="h-16 w-16 flex-shrink-0">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={jobImageUrl} alt={job.schoolName} className="object-cover" />
                  <AvatarFallback>{job.schoolName ? job.schoolName[0] : "J"}</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold">{job.schoolName}</h1>
                <p className="text-gray-600">{job.title}</p>
                <p className="font-medium">Cover: {job.jobDurationDays || "N/A"} days</p>
                <p className="text-sm text-gray-500">{job.jobDurationType || "N/A"}</p>
                <p className="font-medium">
                  {job.currency}{" "}
                  {job.payPerHour ? `${job.payPerHour}/hr` : `${job.payPerDay}/day`}
                </p>
              </div>
            </div>
          </Card>

          {success && (
            <p className="text-green-500 text-center">You have successfully applied for this job!</p>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {hasApplied && (
            <p className="text-center text-blue-500">You have already applied for this job.</p>
          )}
          {isJobExpired && <p className="text-center text-red-500">This job posting has expired.</p>}
          {job.status === "closed" && (
            <p className="text-center text-gray-500">This job is currently closed.</p>
          )}

          <Card className="bg-[#f7fcfc] p-4 border-gray-200">
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

            <div className="mt-4 space-y-1">
              <p className="font-medium">
                Pay: {job.currency} {job.payPerDay || "N/A"} / day
              </p>
              <p className="text-sm text-gray-600">
                Payment Method: {job.paymentMethod || "N/A"}
              </p>
            </div>

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

          {/* Apply Button (conditionally shown) */}
          {isButtonVisible && (
            <div className="flex justify-center">
              <Button
                className="w-[400px] bg-[#2B8A0E] hover:bg-[#247A0C] text-white py-2 rounded-md"
                onClick={handleApplyJob}
                disabled={loading}
              >
                {loading ? "Applying..." : "Apply for the Job"}
              </Button>
            </div>
          )}

          <div className="space-y-4 pt-2">
            <p className="text-center text-[#2B8A0E]">Pay 15.00 QAR</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetail;
