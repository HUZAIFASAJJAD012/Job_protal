import React, {useContext} from 'react'
import {Link} from "react-router-dom";
import {Link as ScrollLink} from 'react-scroll';
import {Store} from "../../Utils/Store"

function Header() {
    const {state} = useContext(Store)
    const {UserInfo} = state
    return (
        <nav className="bg-white py-4 px-6 flex items-center justify-between">
            {/* Logo */}
            <div className="w-12 h-12 bg-gray-200 rounded-full">
                <img
                    src="/logo.jpg"
                    alt="Parkhouse English School"
                    width={64}
                    height={64}
                    className="h-full w-full rounded-full object-cover"
                />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-700 hover:text-gray-900">
                    <strong>Home</strong>
                </Link>
                <ScrollLink
                    to="about-us"
                    smooth={true}
                    duration={500}
                    className="text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                    <strong>About Us</strong>
                </ScrollLink>
                <ScrollLink
                    to="contact-us"
                    smooth={true}
                    duration={500}
                    className="text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                    <strong>Contact Us</strong>
                </ScrollLink>
                <ScrollLink
                    to="pricing"
                    smooth={true}
                    duration={500}
                    className="text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                    <strong>Pricing</strong>
                </ScrollLink>
            </div>
            {UserInfo && UserInfo.isUser ?
                <Link to="/user/job-listing">
                    <button
                        className="bg-[#ffcc00] text-white px-6 py-2 rounded-md hover:bg-[#ffcc00] transition-colors">
                        <strong>Dashboard</strong>
                    </button>
                </Link>
                : UserInfo && UserInfo.isHire ? <Link to="/school-jobs">
                    <button
                        className="bg-[#ffcc00] text-white px-6 py-2 rounded-md hover:bg-[#ffcc00] transition-colors">
                        <strong>Dashboard</strong>
                    </button>
                </Link> : <Link to="/login-choice">
                    <button
                        className="bg-[#2B7A0B] text-white px-6 py-2 rounded-md hover:bg-[#236508] transition-colors">
                        <strong>Login</strong>
                    </button>
                </Link>
            }
        </nav>
    )
}

export default Header
