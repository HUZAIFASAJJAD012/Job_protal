import { useEffect, useState } from "react";
import api from "../../Utils/Axios";
import Sidebar from "./Sidebar";



const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/get_all_users");
        const data = response.data || [];
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-8">
        <h1 className="text-xl font-bold text-gray-800 mb-8 text-center">User List</h1>

        {/* User Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-200 text-xs text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.isAdmin ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-${user.status === "Active" ? "green" : "red"}-600 font-semibold`}>
                    {user.status}
                  </td>
                  <td className="px-6 py-4 text-center space-x-4">

                    <button className="text-red-600 hover:text-red-800 transition duration-300 ease-in-out transform hover:scale-105">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-lg font-semibold text-gray-700">
              {`Page ${currentPage} of ${totalPages}`}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Go to First & Last Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
