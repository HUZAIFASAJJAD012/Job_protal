import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Utils/Axios";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import Header from "./Header";

export default function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        coverFrom: "",
        coverTo: "",
        payPerDay: "",
        payPerHour: "",
        currency: "QAR",
        timeStart: "",
        timeEnd: "",
        paymentMethod: "Bank Transfer",
        qualifications: "",
        backgroundChecks: "",
        jobDurationDays: "",
        jobDurationType: "",
        description: ""
    });
    const [jobImage, setJobImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/school/job/${id}`);
                const job = response.data;

                // Helper function to safely parse nested array/JSON strings
                const parseToCommaString = (field) => {
                    if (!field) return "";
                    
                    // If it's an array
                    if (Array.isArray(field)) {
                        // Check if first element is a JSON string
                        if (field.length > 0 && typeof field[0] === 'string') {
                            try {
                                const parsed = JSON.parse(field[0]);
                                if (Array.isArray(parsed)) {
                                    return parsed.join(", ");
                                }
                            } catch (e) {
                                // If JSON parsing fails, just join the array
                                return field.join(", ");
                            }
                        }
                        return field.join(", ");
                    }
                    
                    // If it's a string that looks like JSON
                    if (typeof field === 'string') {
                        try {
                            const parsed = JSON.parse(field);
                            if (Array.isArray(parsed)) {
                                return parsed.join(", ");
                            }
                            return field;
                        } catch (e) {
                            return field;
                        }
                    }
                    
                    return field.toString();
                };

                setFormData({
                    title: job.title || "",
                    coverFrom: job.coverFrom?.split("T")[0] || "",
                    coverTo: job.coverTo?.split("T")[0] || "",
                    payPerDay: job.payPerDay || "",
                    payPerHour: job.payPerHour || "",
                    currency: job.currency || "QAR",
                    timeStart: job.timeStart || "",
                    timeEnd: job.timeEnd || "",
                    paymentMethod: job.paymentMethod || "Bank Transfer",
                    // Parse the nested array/JSON strings
                    qualifications: parseToCommaString(job.qualifications),
                    backgroundChecks: parseToCommaString(job.backgroundChecks),
                    jobDurationDays: job.jobDurationDays || "",
                    jobDurationType: job.jobDurationType || "",
                    description: job.description || ""
                });

                if (job.jobImage) {
                    setImagePreview(`http://localhost:8000${job.jobImage}`);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load job details.");
            }
        };

        fetchJob();
    }, [id]);

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
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const removeImage = () => {
        setJobImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        if (!formData.title || !formData.coverFrom || !formData.coverTo) {
            setErrors(["Please fill out all required fields."]);
            return;
        }

        try {
            const jobFormData = new FormData();

            // Add basic fields
            jobFormData.append("title", formData.title);
            jobFormData.append("coverFrom", formData.coverFrom);
            jobFormData.append("coverTo", formData.coverTo);
            jobFormData.append("payPerDay", formData.payPerDay);
            jobFormData.append("payPerHour", formData.payPerHour);
            jobFormData.append("currency", formData.currency);
            jobFormData.append("timeStart", formData.timeStart);
            jobFormData.append("timeEnd", formData.timeEnd);
            jobFormData.append("paymentMethod", formData.paymentMethod);
            jobFormData.append("jobDurationDays", formData.jobDurationDays);
            jobFormData.append("jobDurationType", formData.jobDurationType);
            jobFormData.append("description", formData.description);

            // Convert comma-separated strings back to arrays and clean them
            const cleanedQualifications = formData.qualifications
                .split(",")
                .map((q) => q.trim())
                .filter((q) => q !== "");
            const cleanedBackground = formData.backgroundChecks
                .split(",")
                .map((b) => b.trim())
                .filter((b) => b !== "");

            // Send as JSON strings (matching AddJob format)
            jobFormData.append("qualifications", JSON.stringify(cleanedQualifications));
            jobFormData.append("backgroundChecks", JSON.stringify(cleanedBackground));

            if (jobImage) {
                jobFormData.append('jobImage', jobImage);
            }

            await api.put(`/school/job/${id}`, jobFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success("Job updated successfully!");
            navigate("/school-jobs");
        } catch (error) {
            console.error(error);
            setErrors(["Failed to update job. Please try again."]);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center mt-5 mb-5">
                <div className="w-full bg-white max-w-5xl p-6">
                    <h1 className="text-2xl font-bold text-center mb-8">Edit Job</h1>
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

                        {/* Image Upload */}
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
                                    handleMultiSelectChange("qualifications", e.target.value)
                                }
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
                                    handleMultiSelectChange("backgroundChecks", e.target.value)
                                }
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
                                Update Job
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}