"use client"

import React, {useContext, useEffect, useState} from 'react'
import {User, Mail, Phone, Lock, Eye, EyeOff, ChevronDown} from 'lucide-react'
import {Helmet} from "react-helmet";
import Header from "../users/Header";
import api from "../../Utils/Axios";
import {Store} from "../../Utils/Store"
import {toast} from "react-toastify";

export default function UserSettingUpdateForm() {
    const [showPassword, setShowPassword] = useState(false);
    const {state} = useContext(Store)
    const {UserInfo} = state
    const [backgroundChecks, setBackgroundChecks] = useState({
        DBS: false,
        PGCE: false,
        Masters: false,
        "Police Check": false,
    });

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

    // Fetch current user data on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/user/get_user_by_id/${UserInfo.id}`); // Replace with your API endpoint
                const data = response.data;
                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    nationality: data.nationality,
                    residentId: data.residentId,
                    country: data.country,
                    area: data.area,
                    organization: data.organization,
                });
                setBackgroundChecks(data.backgroundChecks || {});
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleCheckboxChange = (check) => {
        setBackgroundChecks((prev) => ({
            ...prev,
            [check]: !prev[check],
        }));
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put(`/user/update_user_by_id/${UserInfo.id}`, {
                ...formData,
                backgroundChecks,
            });
            console.log("User updated successfully:", response.data);
            toast.success("Data Updated")
            // Optionally show a success message or redirect
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <>
            <Helmet><title>Update Settings</title></Helmet>
            <Header/>
            <div className="mx-auto p-8 bg-white rounded-xl" style={{width: "70%"}}>
                <h1 className="text-2xl font-semibold text-center mb-8">Update Settings</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {/* First Name */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600 font-normal">First Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
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
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
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
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
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
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
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
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none appearance-none"
                                required
                            >
                                <option value="">Select country</option>
                                <option value={`${formData.country}`}>{formData.country}</option>
                            </select>
                            <ChevronDown
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"/>
                        </div>
                    </div>

                    {/* Area */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600 font-normal">Area</label>
                        <div className="relative">
                            <select
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none appearance-none"
                                required
                            >
                                <option value="">Choose area</option>
                                <option value={`${formData.area}`}>{formData.area}</option>
                            </select>
                            <ChevronDown
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"/>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600 font-normal">Change Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full pl-10 pr-10 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ?
                                    <EyeOff className="h-5 w-5 text-gray-400"/> :
                                    <Eye className="h-5 w-5 text-gray-400"/>
                                }
                            </button>
                        </div>
                    </div>

                    {/* Nationality */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600 font-normal">Nationality</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                            <input
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                placeholder="Enter nationality"
                                className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600 font-normal">Organization</label>
                        <div className="relative">
                            <select
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-[#F5F5F5] rounded-md focus:outline-none appearance-none"
                            >
                                <option value="">please choose</option>
                                <option value={`${formData.organization}`}>{formData.organization}</option>
                            </select>
                            <ChevronDown
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"/>
                        </div>
                    </div>
                    {/* Resident Id */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600 font-normal">Resident Id No</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
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

                    {/* Background Check */}
                    <div className="col-span-2 space-y-4">
                        <label className="text-sm text-gray-600 font-normal">Background Check</label>
                        <div className="flex justify-between max-w-[500px]">
                            {Object.keys(backgroundChecks).map((check) => (
                                <label key={check} className="flex flex-col items-center cursor-pointer">
                                    <span className="text-sm text-gray-600 mb-0.5">{check}</span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={backgroundChecks[check]}
                                            onChange={() => handleCheckboxChange(check)}
                                            className="w-8 h-8 rounded-[10px] border-2 border-gray-300 bg-white checked:bg-white checked:border-[#2B7A0B] focus:ring-0 focus:ring-offset-0 appearance-none cursor-pointer"
                                        />
                                        <div
                                            className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            {backgroundChecks[check] && (
                                                <svg className="w-6 h-6 text-[#2B7A0B]" fill="none" viewBox="0 3 24 24"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M5 13l4 4L19 7"/>
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>


                    {/* Sign Up Button */}
                    <div className="flex justify-center mt-8">
                        <button type="submit" style={{backgroundColor: "#ffcc00"}}
                                className="px-16 py-2.5 bg-[#ffcc00] text-white rounded-md hover:bg-[#236508] transition-colors">
                            <strong>Update</strong>
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}