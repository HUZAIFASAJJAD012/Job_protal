import { useContext, useState } from "react";
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
        currency: "USD",
        timeStart: "",
        timeEnd: "",
        paymentMethod: "Bank Transfer",
        qualifications: [],
        backgroundChecks: [],
        jobDurationDays: "",
        jobDurationType: "",
        description: "",
    });

    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMultiSelectChange = (name, values) => {
        setFormData({ ...formData, [name]: values });
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
            await api.post("/school/add/job", formData); // Replace "/jobs" with your actual API endpoint
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

                        {/* Job Title */}
                        <div className="space-y-2">
                            <label className="text-sm text-[#666666]">Job Title</label>
                            <input
                                name="title"
                                placeholder="Enter job title"
                                className="w-full h-11 bg-[#E6E6E6]"
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
                                    className="w-full h-11 bg-[#E6E6E6]"
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
                                    className="w-full h-11 bg-[#E6E6E6]"
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
                                    className="w-full h-11 bg-[#E6E6E6]"
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
                                    className="w-full h-11 bg-[#E6E6E6]"
                                    value={formData.payPerHour}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-[#666666]">Currency</label>
                                <input
                                    name="currency"
                                    placeholder="Currency (default: USD)"
                                    className="w-full h-11 bg-[#E6E6E6]"
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
                                className="w-full h-11 bg-[#E6E6E6]"
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
                                className="w-full h-11 bg-[#E6E6E6]"
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
                                    className="w-full h-11 bg-[#E6E6E6]"
                                    value={formData.timeStart}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-[#666666]">Time End</label>
                                <input
                                    type="time"
                                    name="timeEnd"
                                    className="w-full h-11 bg-[#E6E6E6]"
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
                                    className="w-full h-11 bg-[#E6E6E6]"
                                    value={formData.jobDurationDays}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-[#666666]">Job Duration Type</label>
                                <select
                                    name="jobDurationType"
                                    className="w-full h-11 bg-[#E6E6E6]"
                                    value={formData.jobDurationType}
                                    onChange={handleChange}
                                >
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
                                className="w-full h-32 bg-[#E6E6E6]"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-2">
                            <Button className="w-[250px] bg-[#2B8200] hover:bg-green-700 text-white rounded-lg py-4">
                                Add Job
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
