import {useContext, useState} from "react";
import {Button} from "../../components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {Mail, Phone, User, Users} from "lucide-react";
import api from "../../Utils/Axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import Header from "./Header";
import {Store} from "../../Utils/Store";

export default function SchoolSettings() {
    const {state, dispatch} = useContext(Store);
    const {UserInfo} = state;
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        schoolName: UserInfo.schoolName || "",
        country: UserInfo.country || "",
        area: UserInfo.area || "",
        email: UserInfo.email || "",
        phone: UserInfo.phone || "",
        firstName: UserInfo.firstName || "",
        lastName: UserInfo.lastName || "",
        password: "", // Always empty for security
        role: UserInfo.role || "",
    });

    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSelectChange = (field, value) => {
        setFormData({...formData, [field]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); // Clear previous errors
        setIsLoading(true);

        try {
            // Create a copy of formData for submission
            const submitData = { ...formData };
            
            // Remove password from submission if it's empty (optional update)
            if (!submitData.password || submitData.password.trim() === "") {
                delete submitData.password;
            }

            const response = await api.post(`/school/update/${UserInfo.id}`, submitData);
            
            // Update the user info in context with the new data
            dispatch({type: "UserLoggedIn", payload: response.data.user});

            // Show success message
            toast.success(response.data.message || "School settings updated successfully!");
            
            // Clear password field for security
            setFormData(prev => ({ ...prev, password: "" }));

        } catch (error) {
            console.error('Update error:', error);
            
            if (error.response) {
                const { data, status } = error.response;
                
                if (status === 400 && data.errors) {
                    // Validation errors
                    const errorMessages = data.errors.map((err) => err.msg);
                    setErrors(errorMessages);
                    toast.error("Please fix the validation errors");
                } else if (status === 404) {
                    toast.error("School not found");
                } else if (status === 500) {
                    toast.error("Server error. Please try again later.");
                } else {
                    toast.error(data.message || "Failed to update settings");
                }
            } else if (error.request) {
                toast.error("No response from server. Please check your connection.");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header/>
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full bg-white max-w-5xl p-6">
                    <h1 className="text-2xl font-bold text-center mb-8">School Settings</h1>

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

                        {/* School Information Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">School Information</h2>
                            
                            <div className="space-y-2 w-full">
                                <label className="text-sm text-[#666666]">School Name *</label>
                                <input
                                    name="schoolName"
                                    placeholder="Enter school name"
                                    className="w-full h-11 bg-[#E6E6E6] px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.schoolName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-[#666666]">Country *</label>
                                    <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                                        <SelectTrigger className="w-full h-11 bg-[#E6E6E6]">
                                            <SelectValue placeholder="Select country"/>
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="Qatar">Qatar</SelectItem>
                                            <SelectItem value="UAE">UAE</SelectItem>
                                            <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                                            <SelectItem value="Kuwait">Kuwait</SelectItem>
                                            <SelectItem value="Bahrain">Bahrain</SelectItem>
                                            <SelectItem value="Oman">Oman</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-[#666666]">Area *</label>
                                    <Select value={formData.area} onValueChange={(value) => handleSelectChange("area", value)}>
                                        <SelectTrigger className="w-full h-11 bg-[#E6E6E6]">
                                            <SelectValue placeholder="Choose area"/>
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="Doha">Doha</SelectItem>
                                            <SelectItem value="Al Wakrah">Al Wakrah</SelectItem>
                                            <SelectItem value="The Pearl">The Pearl</SelectItem>
                                            <SelectItem value="West Bay">West Bay</SelectItem>
                                            <SelectItem value="Al Rayyan">Al Rayyan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-[#666666]">Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Enter email"
                                            className="w-full h-11 pl-10 pr-3 bg-[#E6E6E6] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-[#666666]">Phone Number *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                                        <input
                                            name="phone"
                                            type="tel"
                                            placeholder="Phone number"
                                            className="w-full h-11 pl-10 pr-3 bg-[#E6E6E6] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-[#666666]">First Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                                        <input
                                            name="firstName"
                                            placeholder="First name"
                                            className="w-full h-11 pl-10 pr-3 bg-[#E6E6E6] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-[#666666]">Last Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                                        <input
                                            name="lastName"
                                            placeholder="Last name"
                                            className="w-full h-11 pl-10 pr-3 bg-[#E6E6E6] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-[#666666]">Password (Optional)</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                                        <input
                                            name="password"
                                            placeholder="Leave blank to keep current password"
                                            className="w-full h-11 pl-10 pr-3 bg-[#E6E6E6] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.password}
                                            onChange={handleChange}
                                            type="password"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Only fill this if you want to change your password</p>
                                </div>

                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-[#666666]">Your Role</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                                        <input
                                            name="role"
                                            placeholder="e.g. Principal, Administrator"
                                            className="w-full h-11 pl-10 pr-3 bg-[#E6E6E6] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.role}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center pt-6">
                            <Button 
                                type="submit"
                                disabled={isLoading}
                                className="w-[250px] bg-[#2B8200] hover:bg-green-700 text-white rounded-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Updating..." : "Update Settings"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}