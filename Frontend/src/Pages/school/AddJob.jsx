import { useContext, useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import api from "../../Utils/Axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { Store } from "../../Utils/Store";

export default function AddJob() {
    const { state } = useContext(Store);
    const { UserInfo } = state;
    const [formData, setFormData] = useState({
        title: "",
        schoolId: UserInfo.id,
        coverFrom: "",
        coverTo: "",
        payPerDay: "",
        payPerHour: "",
        currency: "QAR",
        timeStart: "",
        timeEnd: "",
        paymentMethod: "Bank Transfer",
        qualifications: [],
        backgroundChecks: [],
        jobDurationDays: "",
        jobDurationType: "",
        description: "",
    });

    const [jobImage, setJobImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMultiSelectChange = (name, values) => {
        setFormData({ ...formData, [name]: values });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setJobImage(file);
            
            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const removeImage = () => {
        setJobImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        // Validation (add more as needed)
        if (!formData.title || !formData.coverFrom || !formData.coverTo) {
            setErrors(["Please fill out all required fields."]);
            return;
        }

        try {
            // Create a FormData object to handle file upload
            const jobFormData = new FormData();
            
            // Add all text fields to the FormData
            Object.keys(formData).forEach(key => {
                if (key === 'qualifications' || key === 'backgroundChecks') {
                    jobFormData.append(key, JSON.stringify(formData[key]));
                } else {
                    jobFormData.append(key, formData[key]);
                }
            });
            
            // Add the image file if one was selected
            if (jobImage) {
                jobFormData.append('jobImage', jobImage);
            }

            // Send the request with the FormData
            await api.post("/school/add/job", jobFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success("Job added successfully!");
            navigate("/school-jobs"); // Navigate to the jobs listing page
        } catch (error) {
            console.error(error);
            setErrors(["Failed to add job. Please try again."]);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center mt-5 mb-5">
                <div className="w-full bg-white max-w-5xl p-6">
                    <h1 className="text-2xl font-bold text-center mb-8">Add a New Job</h1>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {errors.length > 0 && (
                            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                                <ul className="list-disc pl-5">
                                    {errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Job Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm text-[#666666]">Job Image</label>
                            <div className="flex flex-col items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                
                                {imagePreview ? (
                                    <div className="relative">
                                        <img 
                                            src={imagePreview} 
                                            alt="Job preview" 
                                            className="w-full max-w-md h-40 object-cover rounded-lg mb-2" 
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div 
                                        onClick={handleImageClick}
                                        className="w-full max-w-md h-40 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer rounded-lg hover:bg-gray-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span className="text-sm text-gray-500 mt-2">Click to upload an image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Job Title */}
                        <div className="space-y-2">
                            <label className="text-sm text-[#666666]">Job Title</label>
                            <input
                                name="title"
                                placeholder="Enter job title"
                                className="w-full h-11 bg-[#E6E6E6] px-3 rounded"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Cover Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-[#666666]">Cover From</label>
                                <input
                                    type="date"
                                    name="coverFrom"
                                    className="w-full h-11 bg-[#E6E6E6] px-3 rounded"
                                    value={formData.coverFrom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-[#666666]">Cover To</label>
                                <input
                                    type="date"
                                    name="coverTo"
                                    className="w-full h-11 bg-[#E6E6E6] px-3 rounded"
                                    value={formData.coverTo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Pay Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-[#666666]">Pay Per Day</label>
                                <input
                                    type="number"
                                    name="payPerDay"
                                    placeholder="Enter daily pay"
                                    className="w-full h-11 bg-[#E6E6E6] px-3 rounded"
                                    value={formData.payPerDay}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-[#666666]">Pay Per Hour</label>
                                <input
                                    type="number"
                                    name="payPerHour"
                                    placeholder="Enter hourly pay"
                                    className="w-full h-11 bg-[#E6E6E6] px-3 rounded"
                                    value={formData.payPerHour}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-[#666666]">Currency</label>
                                <input
                                    name="currency"
                                    placeholder="Currency (default: QAR)"
                                    className="w-full h-11 bg-[#E6E6E6] px-3 rounded"
                                    value={formData.currency}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Qualifications and Background Checks */}
                        <div className="space-y-2">
                            <label className="text-sm text-[#666666]">Qualifications</label>
                            <input
                                name="qualifications"
                                placeholder="Enter qualifications, separated by commas"
                                className="w-full h-11 bg-[#E6E6E6] px-3 rounded"
                                value={formData.qualifications}
                                onChange={(e) =>
                                    handleMultiSelectChange("qualifications", e.target.value.split(","))
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-[#666666]">Background Checks</label>
                            <input
                                name="backgroundChecks"
                                placeholder="Enter background checks, separated by commas"
                                className="w-full h-11 bg-[#E6E6E6] px-3 rounded"
                                value={formData.backgroundChecks}
                                onChange={(e) =>
                                    handleMultiSelectChange("backgroundChecks", e.target.value.split(","))
                                }
                                required
                            />
                        </div>

                        {/* Time Start & End */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-[#666666]">Time Start</label>
                                <input
                                    type="time"
                                    name="timeStart"
                                    className="w-full h-11 bg-[#E6E6E6] px-3 rounded"
                                    value={formData.timeStart}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-[#666666]">Time End</label>
                                <input
                                    type="time"
                                    name="timeEnd"
                                    className="w-full h-11 bg-[#E6E6E6] px-3 rounded"
                                    value={formData.timeEnd}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Job Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-[#666666]">Job Duration (Days)</label>
                                <input
                                    type="number"
                                    name="jobDurationDays"
                                    placeholder="Enter duration in days"
                                    className="w-full h-11 bg-[#E6E6E6] px-3 rounded"
                                    value={formData.jobDurationDays}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-[#666666]">Job Duration Type</label>
                                <select
                                    name="jobDurationType"
                                    className="w-full h-11 bg-[#E6E6E6] px-3 rounded"
                                    value={formData.jobDurationType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select job type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="space-y-2">
                            <label className="text-sm text-[#666666]">Job Description</label>
                            <textarea
                                name="description"
                                placeholder="Enter job description"
                                className="w-full h-32 bg-[#E6E6E6] px-3 py-2 rounded"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-2">
                            <Button 
                                type="submit"
                                className="w-[250px] bg-[#2B8200] hover:bg-green-700 text-white rounded-lg py-4"
                            >
                                Add Job
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}