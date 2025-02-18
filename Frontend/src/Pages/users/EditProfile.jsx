"use client";

import React, {useState, useEffect, useContext} from "react";
import api from "../../Utils/Axios";
import {toast} from "react-toastify";
import {Helmet} from "react-helmet";
import {Store} from "Utils/Store";
import Header from "./Header";
import {useNavigate} from "react-router-dom";
import {server_ip} from "../../Utils/Data";

export default function EditProfilePage() {
    const {state} = useContext(Store);
    const {UserInfo} = state;
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        location: "",
        bio: "",
        skills: [],
        education: [{degree: "", institution: "", year: ""}],
        workHistory: [{position: "", company: "", startDate: "", endDate: ""}],
        availability: {availableDays: []},
    });
    const [profilePicture, setProfilePicture] = useState(null); // For storing selected file
    const [previewImage, setPreviewImage] = useState(""); // For image preview
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch profile data
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/user/get_user_profile/${UserInfo.id}`);
                setFormData(response.data);
                setPreviewImage(response.data.profilePicture || "");
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                toast.error(error.response.data.message);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewImage(URL.createObjectURL(file)); // Generate preview URL
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            form.append("location", formData.location);
            form.append("bio", formData.bio);
            form.append("skills", JSON.stringify(formData.skills));
            form.append("education", JSON.stringify(formData.education));
            form.append("workHistory", JSON.stringify(formData.workHistory));
            form.append("availability", JSON.stringify(formData.availability));
            if (profilePicture) {
                form.append("profilePicture", profilePicture); // Add the image file
            }

            await api.put(`/user/update_user_profile/${UserInfo.id}`, form, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            toast.success("Profile updated successfully!");
            navigate("/user-profile")
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        }
    };

    if (loading) {
        return <p className="text-yellow-600 text-xl font-semibold text-center" style={{marginLeft:"center"}}>.........Loading........</p>
    }

    const handleNestedChange = (e, index, field, section) => {
        const {value} = e.target;
        setFormData((prev) => {
            const updatedSection = [...prev[section]];
            updatedSection[index][field] = value;
            return {...prev, [section]: updatedSection};
        });
    };

    const handleAddNestedField = (section) => {
        setFormData((prev) => ({
            ...prev,
            [section]: [...prev[section], {}],
        }));
    };


    return (
        <>
            <Helmet><title>Edit Profile</title></Helmet>
            <Header/>
            <div className="mx-auto p-8 bg-white rounded-xl" style={{width: "70%"}}>
                <h1 className="text-2xl font-semibold text-center mb-8">Edit Profile</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {/* Location */}
                    <div className="col-span-2 space-y-2">
                        <label className="text-sm text-gray-600 font-normal">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {previewImage && (
                            <img
                                src={`${server_ip}${previewImage}`}
                                alt="Profile Preview"
                                className="mt-2 w-24 h-24 object-cover rounded-full"
                            />
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600 font-normal">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter your location"
                            className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                        />
                    </div>

                    {/* Bio */}
                    <div className="col-span-2 space-y-1">
                        <label className="text-sm text-gray-600 font-normal">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Write a short bio"
                            className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                            rows="3"
                        />
                    </div>

                    {/* Skills */}
                    <div className="col-span-2 space-y-1">
                        <label className="text-sm text-gray-600 font-normal">Skills</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills.join(", ")}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    skills: e.target.value.split(",").map((s) => s.trim()),
                                }))
                            }
                            placeholder="Enter skills separated by commas"
                            className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                        />
                    </div>

                    {/* Education */}
                    <div className="col-span-2 space-y-3">
                        <h2 className="text-lg font-semibold">Education</h2>
                        {formData.education.map((edu, index) => (
                            <div key={index} className="grid grid-cols-3 gap-3">
                                <input
                                    type="text"
                                    placeholder="Degree"
                                    value={edu.degree}
                                    onChange={(e) => handleNestedChange(e, index, "degree", "education")}
                                    className="px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Institution"
                                    value={edu.institution}
                                    onChange={(e) => handleNestedChange(e, index, "institution", "education")}
                                    className="px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                                />
                                <input
                                    type="number"
                                    placeholder="Year"
                                    value={edu.year}
                                    onChange={(e) => handleNestedChange(e, index, "year", "education")}
                                    className="px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddNestedField("education")}
                            className="mt-2 text-blue-500 text-sm underline"
                        >
                            Add More Education
                        </button>
                    </div>

                    {/* Work History */}
                    <div className="col-span-2 space-y-3">
                        <h2 className="text-lg font-semibold">Work History</h2>
                        {formData.workHistory.map((work, index) => (
                            <div key={index} className="grid grid-cols-4 gap-3">
                                <input
                                    type="text"
                                    placeholder="Position"
                                    value={work.position}
                                    onChange={(e) => handleNestedChange(e, index, "position", "workHistory")}
                                    className="px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Company"
                                    value={work.company}
                                    onChange={(e) => handleNestedChange(e, index, "company", "workHistory")}
                                    className="px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                                />
                                <input
                                    type="date"
                                    placeholder="Start Date"
                                    value={work.startDate}
                                    onChange={(e) => handleNestedChange(e, index, "startDate", "workHistory")}
                                    className="px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                                />
                                <input
                                    type="date"
                                    placeholder="End Date"
                                    value={work.endDate}
                                    onChange={(e) => handleNestedChange(e, index, "endDate", "workHistory")}
                                    className="px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddNestedField("workHistory")}
                            className="mt-2 text-blue-500 text-sm underline"
                        >
                            Add More Work History
                        </button>
                    </div>

                    {/* Availability */}
                    <div className="col-span-2 space-y-1">
                        <label className="text-sm text-gray-600 font-normal">Available Days</label>
                        <input
                            type="text"
                            name="availableDays"
                            value={formData.availability.availableDays.join(", ")}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    availability: {
                                        ...prev.availability,
                                        availableDays: e.target.value.split(",").map((d) => d.trim()),
                                    },
                                }))
                            }
                            placeholder="Enter available days separated by commas"
                            className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-2 flex justify-center mt-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"

                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
