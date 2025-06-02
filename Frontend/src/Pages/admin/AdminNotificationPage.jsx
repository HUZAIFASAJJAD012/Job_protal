import React, { useEffect, useState } from "react";
import api from "../../Utils/Axios";
import Sidebar from "./Sidebar";

const AdminNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchPending = async () => {
    const res = await api.get("/notifications/pending");
    setNotifications(res.data);
  };

  const approve = async (id) => {
    await api.put(`/notifications/approve/${id}`);
    fetchPending();
  };

  const reject = async (id) => {
    await api.put(`/notifications/reject/${id}`);
    fetchPending();
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div calassName="flex">
        <Sidebar />
    <div className="w-[calc(100vw-264px)] ml-[264px] bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Notifications</h1>
      {notifications.length === 0 ? (
        <p>No pending notifications</p>
      ) : (
        <div className="grid gap-4">
          {notifications.map((n) => (
            <div key={n._id} className="bg-white shadow-md p-4 rounded-md">
              <p><strong>Name:</strong> {n.name}</p>
              <p><strong>Email:</strong> {n.email}</p>
              <p><strong>Phone:</strong> {n.phone}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => approve(n._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(n._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminNotificationPage;