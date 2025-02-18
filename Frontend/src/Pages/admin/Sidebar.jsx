import {Avatar} from "../../components/ui/avatar";
import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Store} from "Utils/Store"

const Sidebar = () => {
        const {state, dispatch} = useContext(Store)
        const navigate = useNavigate()
        const handleLogout = () => {
            dispatch({type: "ClearUserInfo"});
            localStorage.removeItem("UserInfo");
            navigate("/")
        };
        return (
            <>
                <div className="w-64 bg-gray-900 text-white h-screen p-4 ">
                    <Avatar className="h-25 w-11 m-4 mx-auto">
                        <div className="w-12 h-12 bg-gray-200 rounded-full">
                            <img
                                src="/logo.jpg"
                                alt="Parkhouse English School"
                                width={64}
                                height={64}
                                className="h-full w-full rounded-full object-cover"
                            />
                        </div>
                    </Avatar>
                    <div className="text-center space-x-2 mb-8">
                        {/* Logo */}
                        <h2 className="text-2xl font-bold">Dashboard</h2>
                    </div>
                    <ul>
                        <li className="mb-4">
                            <Link to="/dashboard" className="hover:text-gray-400 text-lg">Dashboard</Link>
                        </li>
                        <li className="mb-4">
                            <Link to="/admin/user-list" className="hover:text-gray-400 text-lg">Users</Link>
                        </li>
                        <li className="mb-4">
                            <Link to="/admin/school-list" className="hover:text-gray-400 text-lg">Schools</Link>
                        </li>
                        <li className="mb-4">
                            <Link to="/admin/job-list" className="hover:text-gray-400 text-lg">Jobs</Link>
                        </li>
                        <li className="mb-4" onClick={handleLogout}>
                            <Link to="#" className="hover:text-gray-400 text-lg">Logout</Link>
                        </li>
                    </ul>
                </div>
            </>
        )
    }
;

export default Sidebar