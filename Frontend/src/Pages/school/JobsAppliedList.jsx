import React, { useContext, useEffect, useState } from 'react';
import Header from "./Header";
import { useNavigate } from 'react-router-dom'; // ✅ Use useNavigate instead of useHistory
import { Link, useParams } from "react-router-dom";
import api from "../../Utils/Axios";
import { Store } from "../../Utils/Store";

function ProfileCard({
    id,
    name = "Anne Hathaway",
    imageUrl = "/placeholder.svg",
    availability = { availableDays: [] },
    dateFrom = "24/11/2024",
    dateTo = "24/12/2024",
    jobsCompleted = 160,
    onSelect
}) {
    const availableDays = availability?.availableDays?.length > 0
        ? availability.availableDays.join(", ")
        : "Not available";

    return (
        <div className="flex items-center justify-between py-4 px-6 rounded-lg drop-shadow-sm bg-white w-full">
            <Link to={`/school-user-profile/${id}`}>
                <div className="flex items-start gap-4">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="space-y-2">
                        <h3 className="text-base font-semibold text-gray-900">{name}</h3>
                        <div className="space-y-0.5 text-sm">
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">Availability:</span>
                                <span className="text-gray-700">{availableDays}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">Date Available from:</span>
                                <span className="text-gray-700">{dateFrom}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">Date Available to:</span>
                                <span className="text-gray-700">{dateTo}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">Jobs Completed:</span>
                                <span className="text-gray-900 font-medium">{jobsCompleted}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <button
                className="px-16 py-3 bg-[#2B8200] hover:bg-[#2B7A0B] text-white text-sm font-medium rounded-md transition-colors"
                onClick={() => onSelect(id)}
            >
                Select
            </button>
        </div>
    );
}

export default function JobsAppliedList() { // ✅ Component name remains the same
    const { state } = useContext(Store);
    const { UserInfo } = state;
    const [appliedCandidate, setAppliedCandidate] = useState([]);
    const [userProfiles, setUserProfiles] = useState([]);
    const { jobId } = useParams();
    const navigate = useNavigate(); // ✅ Correct way to navigate

    useEffect(() => {
        const fetchAppliedCandidates = async () => {
            try {
                const response = await api.get(`/school/get/applied-candidate`);
                setAppliedCandidate(response.data || []);
            } catch (error) {
                console.error("Error fetching applied candidates:", error);
            }
        };

        const fetchAllProfiles = async () => {
            try {
                const response = await api.get("/user/get_user_profile");
                setUserProfiles(response.data || []);
            } catch (error) {
                console.error("Error fetching user profiles:", error);
            }
        };

        fetchAppliedCandidates();
        fetchAllProfiles();
    }, [UserInfo.id]);

    const candidatesForJob = appliedCandidate.filter(candidate => candidate.job === jobId);
    const filteredProfiles = userProfiles.filter(profile =>
        candidatesForJob.some(candidate => candidate.user === profile.user)
    );

    const handleSelect = () => {
        navigate(`/school-chat`); // ✅ Fixed navigation
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-white">
                <div className="max-w-5xl mx-auto p-8">
                    <div className="space-y-7">
                        {filteredProfiles.length > 0 ? (
                            filteredProfiles.map((profile, index) => (
                                <ProfileCard
                                    key={index}
                                    name={profile.name || "Unknown"}
                                    imageUrl={`http://localhost:800${profile.profilePicture}`}
                                    availability={profile.availability}
                                    dateFrom="24/11/2024"
                                    dateTo="24/12/2024"
                                    jobsCompleted={profile.jobsCompleted || 0}
                                    id={profile.user}
                                    onSelect={handleSelect}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center min-h-screen bg-white">
                                <p className="text-red-600 text-xl font-semibold">No candidates have applied for this job yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
