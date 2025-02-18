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
        schoolName: UserInfo.schoolName,
        country: UserInfo.country,
        area: UserInfo.area,
        email: UserInfo.email,
        phone: UserInfo.phone,
        firstName: UserInfo.firstName,
        lastName: UserInfo.lastName,
        password: "",
        role: UserInfo.role,
    });

    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSelectChange = (field, value) => {
        setFormData({...formData, [field]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); // Clear previous errors
        try {
            const response = await api.post(`/school/update/${UserInfo._id}`, formData);
            dispatch({type: "UserLoggedIn", payload: response.data.user});

            toast.success("School Updated Successfully");
            navigate("/school-settings"); // Redirect to the settings page
        } catch (error) {
            const apiErrors = error.response?.data?.errors || [];
            setErrors(apiErrors.map((err) => err.msg)); // Extract error messages
            console.log(error);
        }
    };

    return (
        <>
            <Header/>
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full bg-white max-w-5xl p-6">
                    <h1 className="text-2xl font-bold text-center mb-8">School Setting Update</h1>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2 w-full">
                            {errors.length > 0 && (
                                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                                    <ul className="list-disc pl-5">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <label className="text-sm text-[#666666]">School Name</label>
                            <input
                                name="schoolName"
                                placeholder="Enter name"
                                className="w-full h-11 bg-[#E6E6E6]"
                                value={formData.schoolName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 w-full">
                                <label className="text-sm text-[#666666]">Country</label>
                                <Select onValueChange={(value) => handleSelectChange("country", value)}>
                                    <SelectTrigger className="w-full h-11 bg-[#E6E6E6]">
                                        <SelectValue placeholder="Select country"/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="Qatar">Qatar</SelectItem>
                                        <SelectItem value="UAE">UAE</SelectItem>
                                        <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 w-full">
                                <label className="text-sm text-[#666666]">Area</label>
                                <Select onValueChange={(value) => handleSelectChange("area", value)}>
                                    <SelectTrigger className="w-full h-11 bg-[#E6E6E6]">
                                        <SelectValue placeholder="Choose area"/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="Doha">Doha</SelectItem>
                                        <SelectItem value="Al Wakrah">Al Wakrah</SelectItem>
                                        <SelectItem value="The Pearl">The Pearl</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 w-full">
                                <label className="text-sm text-[#666666]">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Enter email"
                                        className="w-full h-11 pl-10 bg-[#E6E6E6]"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 w-full">
                                <label className="text-sm text-[#666666]">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="Phone number"
                                        className="w-full h-11 pl-10 bg-[#E6E6E6]"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-base font-semibold">Your Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-[#666666]">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                                        <input
                                            name="firstName"
                                            placeholder="First name"
                                            className="w-full h-11 pl-10 bg-[#E6E6E6]"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-[#666666]">Last Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                                        <input
                                            name="lastName"
                                            placeholder="Last name"
                                            className="w-full h-11 pl-10 bg-[#E6E6E6]"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-[#666666]">Password</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                                        <input
                                            name="password"
                                            placeholder="Password"
                                            className="w-full h-11 pl-10 bg-[#E6E6E6]"
                                            value={formData.password}
                                            onChange={handleChange}

                                            type="password"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 w-full">
                                    <label className="text-sm text-[#666666]">Your Role</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500"/>
                                        <input
                                            name="role"
                                            placeholder="e.g principal"
                                            className="w-full h-11 pl-10 bg-[#E6E6E6]"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center pt-2">
                            <Button type="submit"
                                    className="w-[250px] bg-[#2B8200] hover:bg-green-700 text-white rounded-lg py-4">
                                Update
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
