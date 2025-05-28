"use client"

import React, { useContext, useEffect, useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Helmet } from "react-helmet";
import Header from "../users/Header";
import api from "../../Utils/Axios";
import { Store } from "../../Utils/Store";
import { toast } from "react-toastify";

export default function UserSettingUpdateForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { state } = useContext(Store);
  const { UserInfo } = state;

  const [backgroundChecks, setBackgroundChecks] = useState({
    DBS: false,
    PGCE: false,
    Masters: false,
    "Police Check": false,
  });

  // Country & Area lists from your registration form for dropdown options
  const middleEastCountries = [
    "United Arab Emirates",
    "Saudi Arabia",
    "Qatar",
    "Kuwait",
    "Oman",
    "Bahrain",
    "Jordan",
    "Lebanon",
    "Palestine",
    "Syria",
    "Iraq",
    "Iran",
    "Turkey",
    "Yemen",
    "Egypt",
    "Israel",
  ];

  const middleEastAreas = [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Riyadh",
    "Jeddah",
    "Mecca",
    "Medina",
    "Dammam",
    "Doha",
    "Manama",
    "Kuwait City",
    "Muscat",
    "Amman",
    "Beirut",
    "Baghdad",
    "Damascus",
    "Gaza",
    "Tehran",
  ];

  const organizationOptions = [
    "Primary",
    "Middle School",
    "High School",
    "University",
  ];

  // State to control if custom input field is shown for country, area, organization
  const [isCustomCountry, setIsCustomCountry] = useState(false);
  const [isCustomArea, setIsCustomArea] = useState(false);
  const [isCustomOrganization, setIsCustomOrganization] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    nationality: "",
    residentId: "",
    country: "",
    area: "",
    organization: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/user/get_user_by_id/${UserInfo.id}`); // API call
        const { user } = response.data;

        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          nationality: user.nationality || "",
          residentId: user.residentId || "",
          country: user.country || "",
          area: user.area || "",
          organization: user.organization || "",
          password: "", // Always keep blank for security
        });

        setBackgroundChecks(user.backgroundChecks || {
          DBS: false,
          PGCE: false,
          Masters: false,
          "Police Check": false,
        });

        // Check if existing country, area, organization values are not in dropdown => show custom input
        if (user.country && !middleEastCountries.includes(user.country)) {
          setIsCustomCountry(true);
        }
        if (user.area && !middleEastAreas.includes(user.area)) {
          setIsCustomArea(true);
        }
        if (user.organization && !organizationOptions.includes(user.organization)) {
          setIsCustomOrganization(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [UserInfo.id]);

  const handleCheckboxChange = (check) => {
    setBackgroundChecks((prev) => ({
      ...prev,
      [check]: !prev[check],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handlers for dropdown change to toggle custom input
  const handleCountryChange = (e) => {
    if (e.target.value === "other") {
      setIsCustomCountry(true);
      setFormData((prev) => ({ ...prev, country: "" }));
    } else {
      setIsCustomCountry(false);
      handleChange(e);
    }
  };

  const handleAreaChange = (e) => {
    if (e.target.value === "other") {
      setIsCustomArea(true);
      setFormData((prev) => ({ ...prev, area: "" }));
    } else {
      setIsCustomArea(false);
      handleChange(e);
    }
  };

  const handleOrganizationChange = (e) => {
    if (e.target.value === "other") {
      setIsCustomOrganization(true);
      setFormData((prev) => ({ ...prev, organization: "" }));
    } else {
      setIsCustomOrganization(false);
      handleChange(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`/user/update_user_by_id/${UserInfo.id}`, {
        ...formData,
        backgroundChecks,
      });
      console.log("User updated successfully:", response.data);
      toast.success("Data Updated");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update data.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Settings</title>
      </Helmet>
      <Header />
      <div className="mx-auto p-6 sm:p-8 bg-white rounded-xl max-w-4xl w-full">
        <h1 className="text-2xl font-semibold text-center mb-8">Update Settings</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-normal">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-normal">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-normal">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-normal">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Country */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-normal">Country</label>
            <div className="relative">
              {!isCustomCountry ? (
                <>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleCountryChange}
                    className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none appearance-none"
                    required
                  >
                    <option value="">Select country</option>
                    {middleEastCountries.map((country, idx) => (
                      <option key={idx} value={country}>
                        {country}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </>
              ) : (
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter your country"
                  className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                  required
                />
              )}
            </div>
          </div>

          {/* Area */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-normal">Area</label>
            <div className="relative">
              {!isCustomArea ? (
                <>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleAreaChange}
                    className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none appearance-none"
                    required
                  >
                    <option value="">Choose area</option>
                    {middleEastAreas.map((area, idx) => (
                      <option key={idx} value={area}>
                        {area}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </>
              ) : (
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Enter your area"
                  className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                  required
                />
              )}
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-normal">Organization</label>
            <div className="relative">
              {!isCustomOrganization ? (
                <>
                  <select
                    name="organization"
                    value={formData.organization}
                    onChange={handleOrganizationChange}
                    className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none appearance-none"
                  >
                    <option value="">Choose organization</option>
                    {organizationOptions.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </>
              ) : (
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Enter your organization"
                  className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Background Check - full width */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <label className="text-sm text-gray-600 font-normal">Background Check</label>
            <div className="flex flex-wrap justify-between max-w-full md:max-w-[500px] gap-4">
              {Object.keys(backgroundChecks).map((check) => (
                <label key={check} className="flex flex-col items-center cursor-pointer">
                  <span className="text-sm text-gray-600 mb-0.5">{check}</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={backgroundChecks[check]}
                      onChange={() => {
                        setBackgroundChecks((prev) => ({
                          ...prev,
                          [check]: !prev[check],
                        }));
                      }}
                      className="w-8 h-8 rounded-[10px] border-2 border-gray-300 bg-white checked:bg-white checked:border-[#2B7A0B] focus:ring-0 focus:ring-offset-0 appearance-none cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {backgroundChecks[check] && (
                        <svg
                          className="w-6 h-6 text-[#2B7A0B]"
                          fill="none"
                          viewBox="0 3 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Resident Id */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-normal">Resident Id No</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="residentId"
                value={formData.residentId}
                onChange={handleChange}
                placeholder="Enter Id"
                className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-normal">Change Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Submit Button - full width */}
          <div className="col-span-1 md:col-span-2 flex justify-center mt-8">
            <button
              type="submit"
              style={{ backgroundColor: "#ffcc00" }}
              className="px-16 py-2.5 text-white rounded-md hover:bg-[#236508] transition-colors w-full max-w-[300px]"
            >
              <strong>Update</strong>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
