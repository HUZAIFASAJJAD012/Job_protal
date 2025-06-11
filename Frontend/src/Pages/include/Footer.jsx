import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Store } from "../../Utils/Store"; // Adjust path if needed
import api from "../../Utils/Axios";

const Footer = () => {
  const { state } = useContext(Store);
  const { UserInfo } = state;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);

  // Check subscription status when user is logged in
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (UserInfo?.id) {
        setCheckingSubscription(true);
        try {
          const response = await api.get(`/notifications/check/${UserInfo.id}`);
          setIsSubscribed(response.data.isSubscribed);
        } catch (error) {
          console.error("Error checking subscription:", error);
          setIsSubscribed(false);
        } finally {
          setCheckingSubscription(false);
        }
      }
    };

    checkSubscriptionStatus();
  }, [UserInfo]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post("/notifications", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      userId: UserInfo?.id || null,
    });

    alert("Thanks for subscribing to our newsletter!");
    setFormData({ name: "", email: "", phone: "" });
  } catch (error) {
    const msg = error?.response?.data?.message;

    if (msg === "Subscription already exists for this email.") {
      alert("You are already subscribed with this email.");
    } else {
      console.error("Subscription failed:", error);
      alert("Subscription failed. Please try again.");
    }
  }
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
              <ScrollLink to="about-us" className="hover:underline cursor-pointer" smooth duration={500}>
                About Us
              </ScrollLink>
            </li>
            <li>
              <ScrollLink to="blog" className="hover:underline cursor-pointer" smooth duration={500}>
                Blog
              </ScrollLink>
            </li>
            <li>
              <ScrollLink to="contact-us" className="hover:underline cursor-pointer" smooth duration={500}>
                Contact Us
              </ScrollLink>
            </li>
          </ul>
        </div>

        {/* Middle Section */}
        <ul className="space-y-2">
          <li><Link to="/login-choice" className="hover:underline">Login</Link></li>
          <li><Link to="/user/job-listing" className="hover:underline">User</Link></li>
          <li><Link to="/school-jobs" className="hover:underline">School</Link></li>
        </ul>

        {/* Right Section: Newsletter */}
        <div className="w-full max-w-xs">
          <h3 className="mb-4 font-semibold">Sign Up for Newsletter</h3>

          {checkingSubscription ? (
            <p className="bg-blue-100 text-blue-800 p-3 rounded">
              Checking subscription status...
            </p>
          ) : UserInfo && isSubscribed ? (
            <p className="bg-green-100 text-green-800 p-3 rounded">
              You are already subscribed to our newsletter.
            </p>
          ) : (
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
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-2 bg-green-100 text-black rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#FFCC00] text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
