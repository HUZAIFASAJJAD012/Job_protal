import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  isSelected = false,
  onSelect,
}) {
  const availableDays =
    availability?.availableDays?.length > 0
      ? availability.availableDays.join(", ")
      : "Not available";

  return (
    <div
      className={`flex items-center justify-between py-4 px-6 rounded-lg drop-shadow-sm w-full transition-all ${
        isSelected
          ? "bg-green-50 border-2 border-green-300"
          : "bg-white border border-gray-200"
      }`}
    >
      <Link to={`/school-user-profile/${id}`} className="flex items-start gap-4">
        <div className="relative">
          <img
            src={imageUrl}
            alt={name}
            className="w-20 h-20 rounded-full object-cover"
          />
          {isSelected && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">{name}</h3>
            {isSelected && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                SELECTED
              </span>
            )}
          </div>
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
      </Link>

      <button
        className={`px-16 py-3 text-sm font-medium rounded-md transition-colors ${
          isSelected
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-[#2B8200] hover:bg-[#2B7A0B] text-white"
        }`}
        onClick={() => !isSelected && onSelect(id)}
        disabled={isSelected}
      >
        {isSelected ? "Selected" : "Select"}
      </button>
    </div>
  );
}

export default function JobsAppliedList() {
  const { state } = useContext(Store);
  const { UserInfo } = state;
  const [appliedCandidate, setAppliedCandidate] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState(new Set());

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

    const fetchAllUsers = async () => {
      try {
        const response = await api.get("/user/get_all_users");
        setAllUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAppliedCandidates();
    fetchAllProfiles();
    fetchAllUsers();
  }, [UserInfo.id]);

  const candidatesForJob = appliedCandidate.filter(
    (candidate) => candidate.job === jobId
  );

  const filteredProfiles = userProfiles.filter((profile) =>
    candidatesForJob.some((candidate) => candidate.user === profile.user)
  );

  const userIdToNameMap = {};
  allUsers.forEach((user) => {
    userIdToNameMap[user._id] = user.name;
  });

  // Create a map to check selection status from backend
  const selectionStatusMap = {};
  candidatesForJob.forEach((candidate) => {
    selectionStatusMap[candidate.user] = candidate.status === "selected";
  });

  const handleSelect = async (selectedUserId) => {
    const selectedProfile = filteredProfiles.find(
      (profile) => profile.user === selectedUserId
    );

    const selectedUser = allUsers.find((user) => user._id === selectedUserId);

    const selectedUserName = selectedUser?.name || "Unknown";
    const selectedEmail = selectedUser?.email || "example@email.com";
    const selectedPhone = selectedUser?.phone || "0000000000";

    try {
      // Send notification API
      await api.post("/notifications/send-selected", {
        userId: selectedUserId,
        jobId,
        name: selectedUserName,
        email: selectedEmail,
        phone: selectedPhone,
        message: `Congratulations ${selectedUserName}, you have been selected for the job.`,
      });

      // Mark the candidate as selected
      await api.put(`/school/select-candidate/${jobId}/${selectedUserId}`);

      // Update local state immediately
      setSelectedUsers((prev) => new Set([...prev, selectedUserId]));

      // Update applied candidate state
      setAppliedCandidate((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.job === jobId && candidate.user === selectedUserId
            ? { ...candidate, status: "selected" }
            : candidate
        )
      );

      // Store selected user info
      localStorage.setItem(
        "selectedUser",
        JSON.stringify({
          id: selectedUserId,
          name: selectedUserName,
          email: selectedEmail,
          phone: selectedPhone,
          profile: selectedProfile,
        })
      );

      alert(`${selectedUserName} has been selected and marked as chosen.`);

      // Navigate to school-jobs instead of chat
      navigate(`/school-jobs`, { state: { selectedUserId } });
    } catch (error) {
      console.error("Error in selection process:", error);
      alert("Failed to select candidate. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Job Applicants</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Selected:{" "}
                {Object.values(selectionStatusMap).filter(Boolean).length} /{" "}
                {filteredProfiles.length}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Selected</span>
              </div>
            </div>
          </div>

          <div className="space-y-7">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile, index) => (
                <ProfileCard
                  key={index}
                  name={userIdToNameMap[profile.user] || "Unknown"}
                  imageUrl={`http://localhost:8000${profile.profilePicture}`}
                  availability={profile.availability}
                  dateFrom="24/11/2024"
                  dateTo="24/12/2024"
                  jobsCompleted={profile.jobsCompleted || 0}
                  id={profile.user}
                  isSelected={
                    selectionStatusMap[profile.user] || selectedUsers.has(profile.user)
                  }
                  onSelect={handleSelect}
                />
              ))
            ) : (
              <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-red-600 text-xl font-semibold">
                  No candidates have applied for this job yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
