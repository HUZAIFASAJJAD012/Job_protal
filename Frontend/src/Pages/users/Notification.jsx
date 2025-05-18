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
        setJobsAvailable(response.data || []);
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
        <div className="w-full max-w-5xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Notifications</h1>
          <div>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Card
                  key={job._id}
                  className="p-3 mb-4 border-0 shadow-sm bg-[#f7fcfc]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 overflow-hidden rounded-full">
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-21%20234547-10D5DLrL80fLYA5En2D0XV5JInFFWv.png"
                          alt="School"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-base pb-2">
                          {job.title}
                        </h3>
                        <div className="text-xs text-muted-foreground">
                          {job.jobDurationDays} days Cover
                        </div>
                        <div className="font-semibold text-[18px]">
                          {job.payPerHour
                            ? `${job.payPerHour} ${job.currency}/hr`
                            : `${job.payPerDay} ${job.currency}/day`}
                        </div>
                      </div>
                    </div>
                    <Button
                      className="bg-[#2b7a0b] hover:bg-[#236508] text-white px-11 h-10"
                      onClick={() => handleAcceptJob(job)}
                    >
                      Accept Job
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-red-600 text-sm font-semibold">
                No new job notifications or you’ve applied to all available jobs.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
