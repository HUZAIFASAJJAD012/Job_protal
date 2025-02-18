import React, { useContext, useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import api from "../Utils/Axios";
import { Store } from "../Utils/Store"
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
                navigate("/user/job-listing");
            }
        }
    }, [UserInfo, navigate]);  // Add UserInfo and navigate as dependencies to the useEffect

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // Send login request to backend
            const response = await api.post('/auth/login', formData);
            toast.success("User Logged In");

            const user = response.data.user;
            dispatch({ type: "UserLoggedIn", payload: user });

            // Check if the user is admin or regular user
            if (user.isAdmin) {
                navigate("/admin/dashboard");
            } else if (user.isUser) {
                navigate("/user/job-listing");
            } else {
                // If neither, you can set a default redirect or handle it differently
                toast.error("Unknown role or no role assigned.");
                // Optionally, you can redirect to an error page or login page again.
                navigate("/login");
            }
        } catch (error) {
            // Handle errors such as incorrect credentials
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || 'Login failed. Please try again.')
            } else {
                setErrorMessage('An error occurred. Please try again.')
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
                                        className="w-full bg-[#C0DAB3] hover:bg-[#c8d9c9] text-black"
                                    >
                                        Job seeker
                                    </Button>
                                </Link>
                                <Link to="/user-registration">
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
