"use client";

import React, { useState, useEffect, useContext } from "react";
import api from "../../Utils/Axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Store } from "Utils/Store";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { server_ip } from "../../Utils/Data";

export default function EditProfilePage() {
  const { state } = useContext(Store);
  const { UserInfo } = state;
  const navigate = useNavigate();

  // Utility function to format ISO date string to YYYY-MM-DD only
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // Removes time and milliseconds
  };

  const [formData, setFormData] = useState({
    location: "",
    bio: "",
    skills: [],
    education: [{ degree: "", institution: "", year: "" }],
    workHistory: [
      {
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        isCurrentJob: false,
      },
    ],
    availability: { availableDays: [], startDate: "", endDate: "" },
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/user/get_user_profile/${UserInfo.id}`);

        setFormData({
          location: data.location || "",
          bio: data.bio || "",
          skills: data.skills || [],
          education: data.education.length
            ? data.education
            : [{ degree: "", institution: "", year: "" }],
          workHistory: data.workHistory.length
            ? data.workHistory.map((work) => ({
                ...work,
                isCurrentJob: work.isCurrentJob || false,
              }))
            : [
                {
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  isCurrentJob: false,
                },
              ],
          availability: {
            availableDays: data.availability?.availableDays || [],
            startDate: formatDate(data.availability?.startDate),
            endDate: formatDate(data.availability?.endDate),
          },
        });
        setPreviewImage(data.profilePicture || "");
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [UserInfo.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
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
      // Make sure availability dates are sent in YYYY-MM-DD format (they already are)
      form.append("availability", JSON.stringify(formData.availability));
      if (profilePicture) form.append("profilePicture", profilePicture);

      await api.put(`/user/update_user_profile/${UserInfo.id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!");
      navigate("/user-profile");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleNestedChange = (e, index, field, section) => {
    const { value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updated = [...prev[section]];
      updated[index] = { ...updated[index], [field]: fieldValue };
      return { ...prev, [section]: updated };
    });
  };
  const handleAddNestedField = (section, structure) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], structure],
    }));
  };

  if (loading) {
    return (
      <p className="text-yellow-600 text-xl font-semibold text-center">
        .........Loading........
      </p>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Profile</title>
      </Helmet>
      <Header />
      <div className="mx-auto p-8 bg-white rounded-xl" style={{ width: "70%" }}>
        <h1 className="text-2xl font-semibold text-center mb-8">
          Edit Profile
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Profile Picture */}
          <div className="col-span-2 space-y-2">
            <label className="text-sm text-gray-600 font-normal">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {previewImage && (
              <img
                src={
                  previewImage.startsWith("blob:")
                    ? previewImage
                    : `${server_ip}${previewImage}`
                }
                alt="Profile Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full"
              />
            )}
          </div>

          {/* Location */}
          <div className="col-span-1">
            <label className="text-sm text-gray-600 font-normal">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
              placeholder="Enter your location"
            />
          </div>

          {/* Bio */}
          <div className="col-span-2">
            <label className="text-sm text-gray-600 font-normal">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
              placeholder="Write a short bio"
              rows="3"
            />
          </div>

          {/* Skills */}
          <div className="col-span-2">
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
              className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
              placeholder="Enter skills separated by commas"
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
                  onChange={(e) =>
                    handleNestedChange(e, index, "degree", "education")
                  }
                  className="px-4 py-2 bg-[#F5F5F5] rounded-md"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    handleNestedChange(e, index, "institution", "education")
                  }
                  className="px-4 py-2 bg-[#F5F5F5] rounded-md"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) =>
                    handleNestedChange(e, index, "year", "education")
                  }
                  className="px-4 py-2 bg-[#F5F5F5] rounded-md"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleAddNestedField("education", {
                  degree: "",
                  institution: "",
                  year: "",
                })
              }
              className="text-blue-500 text-sm underline"
            >
              Add More Education
            </button>
          </div>

          {/* Work History */}
          <div className="col-span-2 space-y-3">
            <h2 className="text-lg font-semibold">Work History</h2>
            {formData.workHistory.map((work, index) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-md"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Position"
                    value={work.position}
                    onChange={(e) =>
                      handleNestedChange(e, index, "position", "workHistory")
                    }
                    className="px-4 py-2 bg-[#F5F5F5] rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={work.company}
                    onChange={(e) =>
                      handleNestedChange(e, index, "company", "workHistory")
                    }
                    className="px-4 py-2 bg-[#F5F5F5] rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Start Date</label>
                    <input
                      type="date"
                      value={work.startDate ? formatDate(work.startDate) : ""}
                      onChange={(e) =>
                        handleNestedChange(e, index, "startDate", "workHistory")
                      }
                      className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md"
                    />
                  </div>
                  {!work.isCurrentJob && (
                    <div>
                      <label className="text-sm text-gray-600">End Date</label>
                      <input
                        type="date"
                        value={work.endDate ? formatDate(work.endDate) : ""}
                        onChange={(e) =>
                          handleNestedChange(e, index, "endDate", "workHistory")
                        }
                        className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`current-job-${index}`}
                    checked={work.isCurrentJob || false}
                    onChange={(e) => {
                      handleNestedChange(
                        e,
                        index,
                        "isCurrentJob",
                        "workHistory"
                      );
                      // Clear end date when marking as current job
                      if (e.target.checked) {
                        handleNestedChange(
                          { target: { value: "" } },
                          index,
                          "endDate",
                          "workHistory"
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`current-job-${index}`}
                    className="text-sm text-gray-600"
                  >
                    I currently work here
                  </label>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleAddNestedField("workHistory", {
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  isCurrentJob: false, // Add this field
                })
              }
              className="text-blue-500 text-sm underline"
            >
              Add More Work History
            </button>
          </div>

          {/* Availability */}
          <div className="col-span-2 space-y-3">
            <h2 className="text-lg font-semibold">Availability</h2>
            <label className="block">
              Available Days (comma separated)
              <input
                type="text"
                value={formData.availability.availableDays.join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      availableDays: e.target.value
                        .split(",")
                        .map((day) => day.trim()),
                    },
                  }))
                }
                className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md"
                placeholder="e.g. Monday, Tuesday, Friday"
              />
            </label>

            <label className="block">
              Start Date
              <input
                type="date"
                value={formData.availability.startDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      startDate: e.target.value,
                    },
                  }))
                }
                className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md"
              />
            </label>

            <label className="block">
              End Date
              <input
                type="date"
                value={formData.availability.endDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      endDate: e.target.value,
                    },
                  }))
                }
                className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md"
              />
            </label>
          </div>

          <div className="col-span-2 text-center mt-6">
            <button
              type="submit"
              className="px-8 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
