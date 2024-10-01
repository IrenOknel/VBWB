import "./NavBar.css";
import { useNavigate } from "react-router-dom";
import weatherIcon from "../assets/weatherc.png";
import menuIcon from "../assets/menuicon.png";
import logoutIcon from "../assets/iconlogout.png";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const handleMenuClick = () => {
    navigate("/account"); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={weatherIcon} alt="Weather Icon" className="navbar-icon" />
        <span className="navbar-title">Vibe Based Weather Buddy</span>
      </div>
      <div className="navbar-actions">
        <button
          className="menu-button"
          aria-label="Open Menu"
          onClick={handleMenuClick}
        >
          <img src={menuIcon} alt="Menu Icon" className="menu-icon" />
        </button>
        <button
          className="logout-button"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <img src={logoutIcon} alt="Logout Icon" className="logout-icon" />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
