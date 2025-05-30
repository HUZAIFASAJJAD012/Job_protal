import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import api from "../../Utils/Axios"; // Make sure this is your axios instance

const AdminPayments = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [schools, setSchools] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await api.get('/school/get-all-school');
        console.log('Fetched schools:', response.data);
        setSchools(response.data || []);
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

  const fetchUsers = async () => {
      try {
        const response = await api.get("/user/get_all_users");
        const data = response.data || [];
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchSchools();
    fetchUsers();
  }, []);

  const userPayments = users.map((user, index) => ({
    id: index + 1,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    amount: user.fee ?? 0,
    status: user.subscriptionActive ? 'Paid' : 'Pending',
    date: user.subscriptionExpiryDate
      ? new Date(user.subscriptionExpiryDate).toISOString().slice(0, 10)
      : 'N/A',
  }));

  const schoolPayments = schools.map((school, index) => ({
    id: index + 1,
    school: school.schoolName,
    email: school.email,
    amount: school.fee ?? 0,
    status: school.subscriptionActive ? 'Paid' : 'Pending',
    date: school.subscriptionExpiryDate
      ? new Date(school.subscriptionExpiryDate).toISOString().slice(0, 10)
      : 'N/A',
  }));

  const payments = activeTab === 'user' ? userPayments : schoolPayments;

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 min-w-screen bg-gray-100 flex-1">
        <h1 className="text-2xl font-bold mb-4">Admin Payments</h1>

        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('user')}
          >
            User Payments
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'school' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('school')}
          >
            School Payments
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left border-b">#</th>
                <th className="p-2 text-left border-b">{activeTab === 'user' ? 'User Name' : 'School Name'}</th>
                <th className="p-2 text-left border-b">Email</th>
                <th className="p-2 text-left border-b">Amount</th>
                <th className="p-2 text-left border-b">Status</th>
                <th className="p-2 text-left border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{i + 1}</td>
                  <td className="p-2 border-b">{activeTab === 'user' ? p.name : p.school}</td>
                  <td className="p-2 border-b">{p.email}</td>
                  <td className="p-2 border-b">${(p.amount ?? 0).toFixed(2)}</td>
                  <td className={`p-2 border-b ${p.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {p.status}
                  </td>
                  <td className="p-2 border-b">{p.date}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
