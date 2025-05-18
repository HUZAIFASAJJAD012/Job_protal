import React, { useState, useEffect, useContext } from "react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import Header from "../users/Header";
import { Link } from "react-router-dom";
import api from "../../Utils/Axios";
import { Store } from "../../Utils/Store"; // Assuming Store contains UserInfo
import { server_ip } from "../../Utils/Data"; // <-- Your backend URL

// Job Card Component
const JobCard = ({
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
  timeEnd,
  profilePicture,  // Using profilePicture from backend
}) => {
  console.log("JobCard profilePicture prop:", profilePicture);

  return (
    <Link
      to={{
        pathname: `/user/job-detail`,
      }}
      state={{
        job: {
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
          timeEnd,
          profilePicture,
        },
      }}
    >
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex gap-4">
          <div className="relative">
            <Avatar className="h-14 w-14 rounded-full border-[1px] border-black">
              <AvatarImage
                src={
                  profilePicture
                    ? `${server_ip}${profilePicture}`
                    : "https://via.placeholder.com/150"
                }
                alt={schoolName}
                className="object-cover"
              />
              <AvatarFallback>{schoolName ? schoolName[0] : "?"}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-500 text-xs">{schoolName}</p>
            <div className="space-y-1">
              <p className="text-gray-500 text-xs">
                Cover from: {new Date(coverFrom).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-xs">
                Cover to: {new Date(coverTo).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-xs">
                Pay:{" "}
                {payPerDay
                  ? `${payPerDay} ${currency}/day`
                  : `${payPerHour} ${currency}/hour`}
              </p>
            </div>
            <p className="text-gray-600 font-semibold text-xs pt-0.5">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function JobListings() {
  const { state } = useContext(Store);
  const { UserInfo } = state;
  const [jobsAvailable, setJobsAvailable] = useState([]);
  const [jobsApplied, setJobsApplied] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/school/get/job");
        console.log("Jobs fetched:", response.data);
        setJobsAvailable(response.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchAppliedCandidates = async () => {
      try {
        const response = await api.get("/school/get/applied-candidate");
        const allAppliedJobs = response.data || [];

        // Filter applied jobs for current user
        const filteredJobsApplied = allAppliedJobs.filter(
          (appliedJob) => appliedJob.user === UserInfo.id
        );

        setJobsApplied(filteredJobsApplied);
      } catch (error) {
        console.error("Error fetching applied candidates:", error);
      }
    };

    if (UserInfo && UserInfo.id) {
      fetchJobs();
      fetchAppliedCandidates();
    }
  }, [UserInfo]);

  // Filter out jobs user has already applied for
  const filteredJobsAvailable = jobsAvailable.filter(
    (job) => !jobsApplied.some((appliedJob) => appliedJob.job === job._id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8 pb-32">
        <div className="space-y-8 mb-8">
          <Link to="/user/job-search">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-[#2b8200] hover:bg-[#2b8200] text-white"
            >
              SEARCH JOB
            </Button>
          </Link>

          {/* Jobs Available */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Jobs Available</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {filteredJobsAvailable.length > 0 ? (
                filteredJobsAvailable.map((job) => (
                  <JobCard key={job._id} {...job} profilePicture={job.profilePicture} />
                ))
              ) : (
                <p className="text-red-600 text-sm font-semibold">
                  No available jobs at the moment or you have applied to all.
                </p>
              )}
            </div>
          </section>

          {/* Jobs Applied */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Jobs Applied</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {jobsApplied.length > 0 ? (
                jobsApplied.map((appliedJob) => {
                  const jobDetails = jobsAvailable.find(
                    (job) => job._id === appliedJob.job
                  );
                  return jobDetails ? (
                    <JobCard
                      key={jobDetails._id}
                      {...jobDetails}
                      profilePicture={jobDetails.profilePicture}
                    />
                  ) : null;
                })
              ) : (
                <p className="text-red-600 text-sm font-semibold">
                  You haven't applied for any jobs yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
