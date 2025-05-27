import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import Header from "../users/Header";
import api from "../../Utils/Axios";
import { Store } from "../../Utils/Store";
import { Card } from "../../components/ui/card";

export default function Notifications() {
  const { state } = useContext(Store);
  const { UserInfo } = state;
  const [jobsAvailable, setJobsAvailable] = useState([]);
  const [jobsApplied, setJobsApplied] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/school/get/job");
        const processedJobs = (response.data || []).map(job => ({
          ...job,
          imageUrl: job.jobImage ? `http://localhost:8000${job.jobImage}` : null,
        }));
        setJobsAvailable(processedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchAppliedCandidates = async () => {
      try {
        const response = await api.get("/school/get/applied-candidate");
        const allAppliedJobs = response.data || [];
        const filteredJobsApplied = allAppliedJobs.filter(
          (appliedJob) => appliedJob.user === UserInfo.id
        );
        setJobsApplied(filteredJobsApplied);
      } catch (error) {
        console.error("Error fetching applied candidates:", error);
      }
    };

    fetchJobs();
    fetchAppliedCandidates();
  }, [UserInfo]);

  const filteredJobs = jobsAvailable.filter(
    (job) => !jobsApplied.some((appliedJob) => appliedJob.job === job._id)
  );

  const handleAcceptJob = (job) => {
    navigate("/user/job-detail", { state: { job } });
  };

  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-[#FAFAFA]">
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">Notifications</h1>
          <div>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Card
                  key={job._id}
                  className="p-3 mb-4 border-0 shadow-sm bg-[#f7fcfc]"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-0">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-full flex-shrink-0">
                        <img
                          src={
                            job.imageUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              job.schoolName || "Job"
                            )}&background=random`
                          }
                          alt={job.title || "Job"}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base truncate">{job.title}</h3>
                        <div className="text-xs text-muted-foreground mt-1">
                          {job.jobDurationDays} days Cover
                        </div>
                        <div className="font-semibold text-[16px] sm:text-[18px] mt-1">
                          {job.payPerHour
                            ? `${job.payPerHour} ${job.currency}/hr`
                            : `${job.payPerDay} ${job.currency}/day`}
                        </div>
                      </div>
                    </div>
                    <Button
                      className="bg-[#2b7a0b] hover:bg-[#236508] text-white px-8 sm:px-11 py-2 h-10 w-full sm:w-auto text-center"
                      onClick={() => handleAcceptJob(job)}
                    >
                      Accept Job
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-red-600 text-sm font-semibold text-center">
                No new job notifications or you've applied to all available jobs.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
