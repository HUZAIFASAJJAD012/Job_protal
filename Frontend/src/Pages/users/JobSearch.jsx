"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "../../components/ui/select";
import { Bookmark } from "lucide-react";
import Header from "../users/Header";
import { Link } from "react-router-dom";
import api from "../../Utils/Axios";

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
  timeEnd,
  jobImage
}) {
  return (
    <div className="bg-white rounded p-4 sm:p-6 mb-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 relative">
        <img
          src={
            jobImage
              ? `http://localhost:8000${jobImage}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  schoolName || "Job"
                )}&background=random`
          }
          alt={title || "Job"}
          width={64}
          height={64}
          className="rounded-full object-cover w-16 h-16 mb-4 sm:mb-0"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-semibold mb-0.5">{title}</h3>
              <p className="text-gray-500 text-sm mb-1">
                Cover: {new Date(coverFrom).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-6 w-6"
            >
              <Bookmark className="h-5 w-5 stroke-black fill-white" />
            </Button>
          </div>
          <div className="space-y-0.5 text-gray-500 text-sm">
            <p>
              Start: {timeStart} End: {timeEnd}
            </p>
            <p>
              Time: {jobDurationDays} Pay: {payPerDay} {currency}
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:absolute sm:bottom-4 sm:right-4">
          <Button className="bg-[#2b7a0b] text-white text-md hover:bg-[#236508] py-2 px-6">
            Apply Now
          </Button>
        </div>
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
    area: "",
    organization: ""
  });

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await api.get("/school/get/job");
        const processedJobs = (response.data || []).map((job) => ({
          ...job,
          jobImage: job.jobImage || null
        }));
        setJobs(processedJobs);
        setFilteredJobs(processedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }

    fetchJobs();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));

    const newFilters = { ...filters, [key]: value };

    const filtered = jobs.filter((job) => {
      const matchesLocation =
        !newFilters.location ||
        (job.location &&
          job.location.toLowerCase().includes(newFilters.location.toLowerCase()));

      const matchesTitle =
        !newFilters.title ||
        (job.title &&
          job.title.toLowerCase().includes(newFilters.title.toLowerCase()));

      const matchesDailyRate =
        !newFilters.dailyRate ||
        (job.payPerDay && job.payPerDay >= Number(newFilters.dailyRate));

      return matchesLocation && matchesTitle && matchesDailyRate;
    });

    setFilteredJobs(filtered);
  };

  return (
    <>
      <Header />
      <div className="w-full max-w-5xl mx-auto px-4 py-4">
        <h1 className="text-xl font-semibold mb-6 text-center sm:text-left">Job Search</h1>

        {/* Search Filters */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="location" className="text-sm text-gray-600 block mb-1">
                Location
              </label>
              <Input
                id="location"
                type="text"
                className="w-full h-11 text-base px-3"
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="title" className="text-sm text-gray-600 block mb-1">
                Title
              </label>
              <Input
                id="title"
                type="text"
                className="w-full h-11 text-base px-3"
                placeholder="Enter title"
                value={filters.title}
                onChange={(e) => handleFilterChange("title", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="dailyRate" className="text-sm text-gray-600 block mb-1">
                Daily Rate
              </label>
              <Input
                id="dailyRate"
                type="text"
                className="w-full h-11 text-base px-3"
                placeholder="Enter minimum daily rate"
                value={filters.dailyRate}
                onChange={(e) => handleFilterChange("dailyRate", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Area</label>
              <Select onValueChange={(value) => handleFilterChange("area", value)} value={filters.area}>
                <SelectTrigger className="w-full h-11 text-base px-3">
                  <SelectValue placeholder="Choose area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Math">Math</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Organization</label>
              <Select
                onValueChange={(value) => handleFilterChange("organization", value)}
                value={filters.organization}
              >
                <SelectTrigger className="w-full h-11 text-base px-3">
                  <SelectValue placeholder="Choose organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Search Jobs</h2>
          <div>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <Link
                  key={job._id || index}
                  to={{ pathname: "/user/job-detail" }}
                  state={{ job: job }}
                >
                  <JobCard {...job} />
                </Link>
              ))
            ) : (
              <p className="text-gray-500 py-4">No jobs matching your search criteria.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
