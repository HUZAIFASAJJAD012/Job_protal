import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import emailjs from "@emailjs/browser";
import { Store } from "../../Utils/Store"; // Ensure this path is correct
// adjust this import path as needed

const Footer = () => {
  const { state } = useContext(Store);
  const { UserInfo } = state;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
  });

  // Auto-fill from UserInfo
  useEffect(() => {
    if (UserInfo) {
      setFormData((prev) => ({
        ...prev,
        name: UserInfo.name || "",
        email: UserInfo.email || "",
      }));
    }
  }, [UserInfo]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!UserInfo) {
      alert("Please log in before subscribing to notifications.");
      return;
    }

    // Replace with your actual EmailJS values
    const serviceID = "your_service_id";
    const templateID = "your_template_id";
    const publicKey = "your_public_key";

    emailjs.send(serviceID, templateID, formData, publicKey).then(
      (response) => {
        console.log("Email sent successfully!", response.status, response.text);
        alert("Thank you for signing up!");
        setFormData({ name: "", email: "", number: "" });
      },
      (error) => {
        console.error("Email sending error:", error);
        alert("Failed to send. Please try again later.");
      }
    );
  };

  return (
    <footer className="bg-[#005502] text-white py-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between gap-10 px-6">
        {/* Left Section */}
        <div className="flex flex-col md:flex-row items-start">
          <div className="w-16 h-16 bg-gray-300 rounded-full">
            <img
              src="/logo.jpg"
              alt="Parkhouse English School"
              width={64}
              height={64}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <ul className="ml-4 mt-4 md:mt-0 space-y-2">
            <li>
              <ScrollLink to="home" className="hover:underline cursor-pointer" smooth duration={500}>
                Home
              </ScrollLink>
            </li>
            <li>
              <ScrollLink to="about-us" smooth duration={500} className="hover:underline cursor-pointer">
                About Us
              </ScrollLink>
            </li>
            <li>
              <ScrollLink to="blog" smooth duration={500} className="hover:underline cursor-pointer">
                Blog
              </ScrollLink>
            </li>
            <li>
              <ScrollLink to="contact-us" smooth duration={500} className="hover:underline cursor-pointer">
                Contact Us
              </ScrollLink>
            </li>
          </ul>
        </div>

        {/* Middle Section */}
        <ul className="space-y-2">
          <li>
            <Link to="/login-choice" className="hover:underline">
              Login
            </Link>
          </li>
          <li>
            <Link to="/user/job-listing" className="hover:underline">
              User
            </Link>
          </li>
          <li>
            <Link to="/school-jobs" className="hover:underline">
              School
            </Link>
          </li>
        </ul>

        {/* Right Section: Notification Form */}
        <div className="w-full max-w-xs">
          <h3 className="mb-4 font-semibold">Sign Up for Notifications</h3>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 bg-green-100 text-black rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-green-100 text-black rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              placeholder="Enter number"
              className="w-full px-4 py-2 bg-green-100 text-black rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#FFCC00] text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Confirm & Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
