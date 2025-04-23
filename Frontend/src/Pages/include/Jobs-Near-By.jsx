import React from "react";
import {Bookmark, Clock} from "lucide-react";
import {Link} from "react-router-dom";

export default function JobsNearBy({jobs}) {
    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <h2 className="text-[36px] font-bold mb-2">Jobs Nearby</h2>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-12 mb-2">
                {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                        <Link
                            to={{
                                pathname: `/user/job-detail`,
                            }}
                            state={{
                                job: job
                            }}
                        >
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center p-4 bg-[#ECF0FA] rounded-t-2xl">
                                    <h3 className="font-semibold text-[17px] text-gray-900">
                                        {job.title || "Job Title"}
                                    </h3>
                                    <button className="text-gray-800 hover:text-gray-600">
                                        <Bookmark className="w-5 h-5"/>
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3.5">
                                    {/* School Info */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 relative">
                                            <img
                                                src={
                                                    job.image ||
                                                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-01%20202231-FVjv9TGizfnSdARH7nPOukiU2MkI2b.png"
                                                }
                                                alt="School Logo"
                                                className="rounded-lg object-cover"
                                                width={48}
                                                height={48}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[15px] text-gray-900">
                                                {job.schoolName || "School Name"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {`${job.jobDurationDays || "N/A"} ${
                                                    job.jobDurationType || "days"
                                                } Duration`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <p className="text-sm text-gray-500">
                                        Location: {job.location || "Not Specified"}
                                    </p>

                                    {/* Payment Info */}
                                    <p className="text-sm text-gray-500">
                                        {job.payPerDay
                                            ? `Pay Per Day: ${job.currency} ${job.payPerDay}`
                                            : job.payPerHour
                                                ? `Pay Per Hour: ${job.currency} ${job.payPerHour}`
                                                : "Pay: Not Specified"}
                                    </p>

                                    {/* Posted Time */}
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500 pt-5">
                                        <Clock className="w-4 h-4"/>
                                        <span>{job.createdAt ? new Date(job.createdAt).toDateString() : "Recently Posted"}</span>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center pt-5">
                                        <button
                                            className="bg-[#2B7A0B] text-white px-4 py-2 rounded-md text-sm hover:bg-[#236508] transition-colors"
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-red-600 text-xl font-semibold">No jobs available at the moment</p>
                )}
            </div>
        </section>
    );
}
