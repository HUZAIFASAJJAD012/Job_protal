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
  onSelect,
}) {
  const availableDays =
    availability?.availableDays?.length > 0
      ? availability.availableDays.join(", ")
      : "Not available";

  return (
    <div className="flex items-center justify-between py-4 px-6 rounded-lg drop-shadow-sm bg-white w-full">
      <Link to={`/school-user-profile/${id}`} className="flex items-start gap-4">
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

export default function JobsAppliedList() {
  const { state } = useContext(Store);
  const { UserInfo } = state;
  const [appliedCandidate, setAppliedCandidate] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { jobId } = useParams();
  const navigate = useNavigate();

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

      // Remove the selected candidate from the applied candidates list
      // This assumes you have a backend endpoint to remove the application
      await api.delete(`/school/remove-application/${jobId}/${selectedUserId}`);

      // Update local state to immediately remove the user from the UI
      setAppliedCandidate((prevCandidates) =>
        prevCandidates.filter(
          (candidate) => !(candidate.job === jobId && candidate.user === selectedUserId)
        )
      );

      // Store selected user info and navigate
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

      alert(`${selectedUserName} has been selected and removed from the list.`);
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
