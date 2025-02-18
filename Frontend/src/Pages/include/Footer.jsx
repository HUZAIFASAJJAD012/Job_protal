import React from "react";

const Footer = () => {
  return (
    <footer style={{backgroundColor:"#005502"}} className="text-white py-8">
      <div className="container mx-auto flex justify-between items-start">
        {/* Left Section */}
        <div className="flex items-start">
          <div className="w-16 h-16 bg-gray-300 rounded-full">
            <img
                src="/logo.jpg"
                alt="Parkhouse English School"
                width={64}
                height={64}
                className="h-full w-full rounded-full object-cover"
            />
          </div>
          <ul className="ml-4 space-y-2">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>

        {/* Middle Section */}
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">Login</a></li>
          <li><a href="#" className="hover:underline">User</a></li>
          <li><a href="#" className="hover:underline">School</a></li>
        </ul>

        {/* Right Section */}
        <div>
          <h3 className="mb-4 font-semibold">Sign Up for Notifications</h3>
          <form className="space-y-3">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 bg-green-100 text-black rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-green-100 text-black rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Enter Number"
              className="w-full px-4 py-2 bg-green-100 text-black rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
