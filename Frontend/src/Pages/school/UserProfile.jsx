"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Store } from "../../Utils/Store";
import Header from "./Header";
import api from "../../Utils/Axios";
import { server_ip } from "../../Utils/Data";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const { state } = useContext(Store);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, userRes] = await Promise.all([
          api.get(`/user/get_user_profile/${id}`),
          api.get(`/user/get_user_by_id/${id}`),
        ]);
        console.log("Profile Response:", profileRes.data);
        setProfile(profileRes.data);
        setUser(userRes.data);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSelect = () => {
    navigate("/school-jobs", { state: { selectedUserId: id } });
  };

  // Helper function to format date string as YYYY-MM-DD
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toISOString().slice(0, 10) : "N/A";
  };

  if (!profile || !user) {
    return <p className="text-center text-gray-500">Loading profile...</p>;
  }

  return (
    <>
      <Header />
      <div className="bg-[#F8FAFC] min-h-screen px-6 py-10">
        <div className="max-w-8xl mx-auto bg-white shadow-md rounded-xl p-8 relative">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start sm:items-center gap-6">
              <img
                src={
                  profile.profilePicture
                    ? `${server_ip}${profile.profilePicture}`
                    : "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-300"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  {profile.user?.name}
                  <span className="text-blue-500 text-xl">•</span>
                </h1>
                <p className="text-gray-600">
                  📍 {profile.location || "Location"}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {profile.jobsCompleted || 0} jobs completed
                </p>
              </div>
            </div>

            {/* Right Side Buttons */}
            <div className="mt-4 sm:mt-0 flex flex-col items-end gap-2">
              <button
                onClick={handleSelect}
                className="bg-green-600 text-white px-5 py-3 rounded-lg text-xl font-medium hover:bg-green-700"
              >
                Select
              </button>
              <p className="text-gray-700 font-semibold mt-1">
                ${profile.hourlyRate || 10}/hr
              </p>
            </div>
          </div>

          {/* Bio */}
          <Section title="Expert French Teacher">
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </Section>

          {/* Employment History */}
          <Section title="Employment History">
            {profile?.workHistory?.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                {profile.workHistory.map((work, i) => (
                  <li key={i}>
                    <strong>{work.position}</strong> — {work.company} (
                    {formatDate(work.startDate)} –{" "}
                    {work.endDate ? formatDate(work.endDate) : "Present"})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No employment history available.</p>
            )}
          </Section>

          {/* Education */}
          <Section title="Education">
            {profile?.education?.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                {profile.education.map((edu, i) => (
                  <li key={i}>
                    <strong>{edu.degree}</strong> – {edu.institution} (
                    {edu.year})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No education details provided.</p>
            )}
          </Section>

          {/* Skills */}
          <Section title="Skills">
            {profile?.skills?.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                {profile.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p>No skills listed.</p>
            )}
          </Section>

          {/* Availability */}
          <div className="mt-6 flex flex-wrap gap-4">
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              Available from: {formatDate(profile.availability?.startDate)}
            </span>
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              Available to: {formatDate(profile.availability?.endDate)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
      {children}
    </div>
  );
}
