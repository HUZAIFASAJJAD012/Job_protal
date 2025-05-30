import { useEffect, useState } from "react";
import api from "../../Utils/Axios";
import Sidebar from "./Sidebar";

const SchoolList = () => {
  const [schools, setSchools] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const schoolsPerPage = 20;

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await api.get("/school/get-all-school"); // Your API endpoint to get school data
        const data = response.data || [];
        setSchools(data);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchSchools();
  }, []);

  const indexOfLastSchool = currentPage * schoolsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
  const currentSchools = schools.slice(indexOfFirstSchool, indexOfLastSchool);
  const totalPages = Math.ceil(schools.length / schoolsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleDelete = async (id) => {
    console.log("Deleting user with ID:", id); // Add this line
    if (window.confirm("Are you sure you want to delete this user?")) {
        try {
            const response = await api.delete(`/school/scdelete/${id}`);
            console.log("Delete response:", response.data);
            setSchools(schools.filter(schools => schools._id !== id));
            alert("school deleted successfully.");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    }
};

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className=" bg-gray-100 p-8 w-[calc(100vw-264px)] ml-[264px] ">
        <h1 className="text-xl font-bold text-gray-800 mb-8 text-center">School List</h1>

        {/* School Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-200 text-xs text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">School Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Country</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSchools.map((school, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{school.schoolName}</td>
                  <td className="px-6 py-4 text-gray-700">{school.email}</td>
                  <td className="px-6 py-4 text-gray-700">{school.country}</td>
                  <td className="px-6 py-4 text-gray-700">{school.phone}</td>
                  <td className="px-6 py-4 text-center space-x-4">
                    <button onClick={() => handleDelete(school._id)} className="text-red-600 hover:text-red-800 transition duration-300 ease-in-out transform hover:scale-105">
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

export default SchoolList;
