import React, { useContext, useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import api from "../Utils/Axios";
import { Store } from "../Utils/Store";
import { toast } from "react-toastify";

export default function Login() {
    const { state, dispatch } = useContext(Store);
    const { UserInfo } = state;
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');  // State for handling error messages

    // Redirect if already logged in
    useEffect(() => {
        if (UserInfo) {
            if (UserInfo.isAdmin) {
                navigate("/admin/dashboard");
            } else if (UserInfo.isUser) {
                console.log("userjobs");
                navigate("/user/job-listing");
            } else {
                console.log("schooljobs");
                navigate("/school-jobs");
            }
        }
    }, [UserInfo, navigate]);  // Make sure to add dependencies

    // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await api.post('/auth/login', formData);
        const user = response.data.user;

        // Show success message
        toast.success("User logged in successfully!");

        // Dispatch login state
        dispatch({ type: "UserLoggedIn", payload: user });

        // Navigate based on user role
        if (user.isAdmin) {
            navigate("/admin/dashboard");
        } else if (user.isUser) {
            navigate("/user/job-listing");
        } else {
            navigate("/school-jobs");
        }

        setErrorMessage(""); // Clear error state if previously set

    } catch (error) {
        console.error('Login error:', error);

        if (error.response) {
            const { status, data } = error.response;

            // Custom error messages based on backend response
            if (status === 401) {
                setErrorMessage(data.message || "Invalid email or password.");
                toast.error(data.message || "Invalid email or password.");
            } else if (status === 403) {
                setErrorMessage("Access denied. Please contact support.");
                toast.error("Access denied. Please contact support.");
            } else if (status === 500) {
                setErrorMessage("Internal server error. Try again later.");
                toast.error("Internal server error. Try again later.");
            } else {
                setErrorMessage(data.message || "Login failed. Please try again.");
                toast.error(data.message || "Login failed. Please try again.");
            }

        } else if (error.request) {
            setErrorMessage("No response from server. Please check your internet connection.");
            toast.error("No response from server. Please check your internet connection.");
        } else {
            setErrorMessage(error.message || "Unexpected error occurred.");
            toast.error(error.message || "Unexpected error occurred.");
        }
    }
};


    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <Card className="w-full max-w-lg p-6 bg-[#f7fcfc] rounded-lg border-0">
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

                        {/* Display error message if exists */}
                        {errorMessage && (
                            <div className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4">
                                {errorMessage}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Email</label>
                            <div>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-100 rounded-md border-gray-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Password</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-100 rounded-md border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#2b8200] hover:bg-green-700 text-white py-2 rounded-md"
                        >
                            <strong>Login</strong>
                        </Button>

                        <div className="text-center text-gray-500">Or</div>

                        <div className="space-y-4">
                            <p className="text-center font-medium">Register as</p>
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/user-registration">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="w-full bg-[#a4d18e] hover:bg-[#c8d9c9] text-black"
                                    >
                                        Job seeker
                                    </Button>
                                </Link>
                                <Link to="/school-registration">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full bg-white hover:bg-gray-50"
                                    >
                                        I want to Hire
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
