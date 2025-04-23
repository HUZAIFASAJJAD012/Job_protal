"use client";
import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import {ExternalLink, Check} from "lucide-react";
import Header from "./Header";
import {Link, useParams} from "react-router-dom";
import api from "../../Utils/Axios";
import {Store} from "../../Utils/Store"
import {server_ip} from "../../Utils/Data";

export default function UserProfile() {
    const [profile, setProfile] = useState(null); // State to store profile data
    const [user, setUser] = useState(null); // State to store profile data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const {state} = useContext(Store)
    const {UserInfo} = state
    const {id} = useParams();


     useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/user/get_user_profile/${id}`);
                setProfile(response.data); // Update profile state
            } catch (error) {
                setError("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]); // Added 'id' as a dependency to re-fetch if 'id' changes

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/user/get_user_by_id/${id}`);
                setUser(response.data); // Update user state
            } catch (error) {
                setError("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleDayToggle = (day) => {
        setProfile((prev) => ({
            ...prev,
            availability: {
                ...prev.availability,
                availableDays: prev.availability.availableDays.includes(day)
                    ? prev.availability.availableDays.filter((d) => d !== day)
                    : [...prev.availability.availableDays, day],
            },
        }));
    };

    if (loading) {
        return <p className="text-yellow-600 text-xl font-semibold text-center"
                  style={{marginLeft: "center"}}>.........Loading........</p>

    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }


    return (
        <>
            <Header/>
            <div className="min-h-screen bg-[#ECF0FA] p-6">
                <div className="max-w-3xl mx-auto space-y-4">
                    {/* Profile Header */}
                    <div className="bg-white rounded-lg p-6 border border-[#C5BEBE]">
                        <div className="relative">
                            <div className="flex flex-col items-start">
                                <div className="relative w-fit">
                                    <img
                                        src={`${server_ip}${profile?.profilePicture}` || "https://via.placeholder.com/150"}
                                        alt={profile?.user?.name || "Profile Picture"}
                                        className="w-20 h-20 rounded-full object-cover"
                                    />

                                    <button
                                        className="absolute -bottom-1 -right-4 bg-white rounded-full hover:bg-gray-50"
                                        aria-label="Change profile picture"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="w-5 h-5 text-[#404040]"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <h1 className="text-2xl font-semibold mt-3">
                                    {user ? user.firstName : "Loading..."}
                                </h1>

                                <div className="flex items-center gap-1 text-sm text-[#404040] mt-1">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-4 h-4 text-[#404040]"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z"
                                        />
                                    </svg>
                                    <span>{profile.location || "Location not provided"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="bg-white rounded-lg p-6 border border-[#C5BEBE]">
                        <h2 className="text-2xl font-semibold mb-3">Bio</h2>
                        <p className="text-[#404040]">{profile.bio || "No bio provided."}</p>
                    </div>

                    {/* Skills */}
                    <div className="bg-white rounded-lg p-6 border border-[#C5BEBE]">
                        <h2 className="text-2xl font-semibold mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.length > 0 ? (
                                profile.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-[#E9F7F7] text-gray-700 rounded-full border border-[#C5BEBE] text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p>No skills added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Work History */}
                    <div className="bg-white rounded-lg p-6 border border-[#C5BEBE]">
                        <h2 className="text-2xl font-semibold mb-3">Work History</h2>
                        {profile.workHistory.length > 0 ? (
                            profile.workHistory.map((work, index) => (
                                <div key={index} className="mb-4">
                                    <h3 className="font-medium"><strong>Position : </strong> {work.position}</h3>
                                    <div className="text-sm text-[#404040]">
                                        <p><strong>Name : </strong> {work.company}</p>
                                        <p><strong>Started Date : </strong>
                                            {new Date(work.startDate).toLocaleDateString()} -{" "}
                                            <strong>Ended : </strong>
                                            {work.endDate
                                                ? new Date(work.endDate).toLocaleDateString()
                                                : "Present"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No work history available.</p>
                        )}
                    </div>

                    {/* Education */}
                    <div className="bg-white rounded-lg p-6 border border-[#C5BEBE]">
                        <h2 className="text-2xl font-semibold mb-3">Education</h2>
                        {profile.education.length > 0 ? (
                            profile.education.map((edu, index) => (
                                <div key={index} className="mb-2">
                                    <p><strong>Institute : </strong> {edu.institution}</p>
                                    <p><strong>Degree : </strong> {edu.degree}</p>
                                    <p><strong>Year : </strong> {edu.year}</p>
                                </div>
                            ))
                        ) : (
                            <p>No education information provided.</p>
                        )}
                    </div>

                    {/* Availability */}
                    <div className="bg-white rounded-lg p-6 border border-[#C5BEBE]">
                        <h2 className="text-2xl font-semibold mb-3">Availability</h2>
                        <div className="grid grid-cols-7 gap-4">
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                                (day) => (
                                    <div key={day} className="flex flex-col items-center">
                                        <span className="mb-2 text-lg font-normal">{day}</span>
                                        <div
                                            className={`w-12 h-12 rounded-2xl border border-gray-300 flex items-center justify-center ${
                                                profile.availability.availableDays.includes(day)
                                                    ? "bg-green-100"
                                                    : "bg-white"
                                            }`}
                                        >
                                            {profile.availability.availableDays.includes(day) && (
                                                <Check className="w-7 h-7 text-green-500" strokeWidth={2}/>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
