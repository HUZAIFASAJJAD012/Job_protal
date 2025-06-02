import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Store } from "../../Utils/Store"; // Adjust path as needed
import api from "../../Utils/Axios"; // Axios instance with baseURL setup

const Footer = () => {
  const { state } = useContext(Store);
  const { UserInfo } = state;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // status can be 'none' (no application), 'pending' (applied but not approved), 'approved'
  const [notificationStatus, setNotificationStatus] = useState("none");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (UserInfo) {
      setFormData({
        name: UserInfo.name || "",
        email: UserInfo.email || "",
        phone: "",
      });

      const checkApproval = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/notifications/status/${UserInfo.id}`);
          setNotificationStatus(res.data.status || "none");
        } catch (error) {
          console.error("Failed to fetch approval status", error);
          setNotificationStatus("none");
        } finally {
          setLoading(false);
        }
      };
      checkApproval();
    } else {
      setNotificationStatus("none");
      setLoading(false);
      setFormData({ name: "", email: "", phone: "" });
    }
  }, [UserInfo]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!UserInfo) {
      alert("Please log in before subscribing.");
      return;
    }

    if (notificationStatus === "approved") {
      alert("You are already approved and subscribed.");
      return;
    }

    if (notificationStatus === "pending") {
      alert("You have already applied and are waiting for approval.");
      return;
    }

    if (notificationStatus === "rejected") {
      alert("You have been rejected.");
      return;
    }

    try {
      await api.post("/notifications", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        userId: UserInfo.id,
      });

      alert("Request sent! Please wait for admin approval.");
      setFormData({ name: "", email: "", phone: "" });
      setNotificationStatus("pending"); // update local status
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send. Try again.");
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
              width={64}
              height={64}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <ul className="ml-4 mt-4 md:mt-0 space-y-2">
            <li>
              <ScrollLink
                to="home"
                className="hover:underline cursor-pointer"
                smooth
                duration={500}
              >
                Home
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="about-us"
                smooth
                duration={500}
                className="hover:underline cursor-pointer"
              >
                About Us
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="blog"
                smooth
                duration={500}
                className="hover:underline cursor-pointer"
              >
                Blog
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="contact-us"
                smooth
                duration={500}
                className="hover:underline cursor-pointer"
              >
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

          {loading ? (
            <p>Loading status...</p>
          ) : notificationStatus === "approved" ? (
            <p className="bg-green-100 text-green-800 p-3 rounded">
              You are already approved for notifications.
            </p>
          ) : notificationStatus === "pending" ? (
            <p className="bg-yellow-100 text-yellow-800 p-3 rounded">
              You have already applied and are waiting for approval.
            </p>
          ) :notificationStatus === "rejected" ? (
            <p className="bg-yellow-100 text-red-600 p-3 rounded">
              You have been rejected by admin for notifications.
            </p>
          ): (
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
                Confirm & Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
