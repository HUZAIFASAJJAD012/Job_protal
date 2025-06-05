import React, { useEffect, useState } from "react";
import api from "../../Utils/Axios";
import Sidebar from "./Sidebar";
import dayjs from "dayjs";

const AdminNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchPending = async () => {
    const res = await api.get("/notifications/pending");
    // Sort notifications by createdAt (latest first)
    const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setNotifications(sorted);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-[calc(100vw-264px)] ml-[264px] bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Subscribed Users</h1>
        {notifications.length === 0 ? (
          <p>No Subscribed Users</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-md">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Phone</th>
                  <th className="text-left px-4 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n) => (
                  <tr key={n._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2">{n.name}</td>
                    <td className="px-4 py-2">{n.email}</td>
                    <td className="px-4 py-2">{n.phone}</td>
                    <td className="px-4 py-2">{dayjs(n.createdAt).format("DD MMM YYYY, h:mm A")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationPage;
