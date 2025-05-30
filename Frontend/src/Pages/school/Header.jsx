import { Avatar } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { Store } from "Utils/Store";

const Header = () => {
    const { dispatch } = useContext(Store);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch({ type: "ClearUserInfo" });
        localStorage.removeItem("UserInfo");
        navigate("/");
    };

    return (
        <>
            <header className="flex items-center justify-between border-b bg-[#ECF0FA] px-4 sm:px-6 py-4 relative">
                {/* Logo */}
                <Link to="/">
                
                <Avatar className="h-11 w-11">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                        <img
                            src="/logo.jpg"
                            alt="Parkhouse English School"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </Avatar>
                </Link>


                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-4 lg:space-x-8">
                    <Link to="/school-jobs"><Button variant="ghost">Home</Button></Link>
                    <Link to="/school-jobs"><Button variant="ghost">Job</Button></Link>
                    <Link to="/school-settings"><Button variant="ghost">Settings</Button></Link>
                </nav>

                {/* Right Controls */}
                <div className="flex items-center space-x-2">
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button variant="ghost" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X /> : <Menu />}
                        </Button>
                    </div>

                    {/* Logout Button - Desktop only */}
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="hidden md:flex items-center gap-1 bg-[#ffcc00] text-black"
                    >
                        Log-Out
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* Mobile Nav */}
            {menuOpen && (
                <div className="md:hidden flex flex-col space-y-2 px-6 py-4 bg-[#ECF0FA] border-b animate-slideDown">
                    <Link to="/" onClick={() => setMenuOpen(false)}>
                        <Button variant="ghost" className="w-full text-left">Home</Button>
                    </Link>
                    <Link to="/school-jobs" onClick={() => setMenuOpen(false)}>
                        <Button variant="ghost" className="w-full text-left">Job</Button>
                    </Link>
                    <Link to="/school-settings" onClick={() => setMenuOpen(false)}>
                        <Button variant="ghost" className="w-full text-left">Settings</Button>
                    </Link>
                    <Button
                        onClick={() => {
                            handleLogout();
                            setMenuOpen(false);
                        }}
                        variant="ghost"
                        className="flex items-center gap-1 bg-[#ffcc00] text-black w-full justify-start"
                    >
                        Log-Out
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </>
    );
};

export default Header;
