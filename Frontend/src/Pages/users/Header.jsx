import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      <header className="flex items-center justify-between border-b bg-[#ECF0FA] px-6 py-4 relative z-50">
        {/* Left: Logo */}
        <Link to="/">
          <Avatar className="h-11 w-11">
            <AvatarImage src="/placeholder.svg" />
            <div className="w-11 h-11 bg-gray-200 rounded-full overflow-hidden">
              <img
                src="/logo.jpg"
                alt="Parkhouse English School"
                className="h-full w-full object-cover"
              />
            </div>
          </Avatar>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-4">
          <Link to="/"><Button variant="ghost">Home</Button></Link>
          <Link to="/user/job-listing"><Button variant="ghost">Job</Button></Link>
          <Link to="/user-profile"><Button variant="ghost">Profile</Button></Link>
          <Link to="/user-chat"><Button variant="ghost">Chat</Button></Link>
          <Link to="/user/settings/update"><Button variant="ghost">Settings</Button></Link>
          <Link to="/user/notification"><Button variant="ghost">Notification</Button></Link>
        </nav>

        {/* Right: Mobile Toggle + Logout */}
        <div className="flex items-center gap-2">
          {/* Logout Button for Desktop */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="hidden md:flex items-center gap-1 bg-[#ffcc00]"
          >
            Log-Out
            <LogOut className="h-4 w-4" />
          </Button>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col space-y-2 px-6 py-4 bg-[#ECF0FA] border-b animate-slideDown">
          <Link to="/" onClick={() => setMenuOpen(false)}><Button variant="ghost">Home</Button></Link>
          <Link to="/user/job-listing" onClick={() => setMenuOpen(false)}><Button variant="ghost">Job</Button></Link>
          <Link to="/user-profile" onClick={() => setMenuOpen(false)}><Button variant="ghost">Profile</Button></Link>
          <Link to="/user-chat" onClick={() => setMenuOpen(false)}><Button variant="ghost">Chat</Button></Link>
          <Link to="/user/settings/update" onClick={() => setMenuOpen(false)}><Button variant="ghost">Settings</Button></Link>
          <Link to="/user/notification" onClick={() => setMenuOpen(false)}><Button variant="ghost">Notification</Button></Link>
          <Button
            onClick={() => { handleLogout(); setMenuOpen(false); }}
            variant="ghost"
            className="flex items-center gap-1 bg-[#ffcc00]"
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
