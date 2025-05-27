import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import api from "../../Utils/Axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FiMenu } from "react-icons/fi";

const Dashboard = () => {
  const [schools, setSchools] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const stats = [
    { name: "Schools", value: schools.length },
    { name: "Jobs", value: jobs.length },
    { name: "Users", value: users.length },
  ];

  const COLORS = ["#6366F1", "#10B981", "#EC4899"];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [schoolsRes, jobsRes, usersRes] = await Promise.all([
          api.get("/school/get-all-school"),
          api.get("/school/get/job"),
          api.get("/user/get_all_users"),
        ]);
        setSchools(schoolsRes.data || []);
        setJobs(jobsRes.data || []);
        setUsers(usersRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed z-50 md:hidden inset-0 bg-black bg-opacity-50 ${showSidebar ? "block" : "hidden"}`}>
        <div className="w-64 bg-white h-full p-6">
          <button onClick={() => setShowSidebar(false)} className="text-right w-full mb-6 font-bold">✕</button>
          <Sidebar />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 w-full">
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setShowSidebar(true)}
          className="md:hidden mb-4 text-gray-700"
        >
          <FiMenu size={24} />
        </button>

        <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h2 className="text-lg font-semibold text-gray-700">{item.name}</h2>
              <p className="text-3xl font-bold text-indigo-600">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Entities Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Entity Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {stats.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
