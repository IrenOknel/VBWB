import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import "./MyAccount.css";
import heartIcon from "../assets/iconheart.png";
import updateIcon from "../assets/iconupdate.png";
import removeIcon from "../assets/iconsremove.png";
import leftIcon from "../assets/iconback.png";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage
} from "../utils/localStorageHelper";

const MyAccount = () => {
  const [activeSection, setActiveSection] = useState("My Favourites");
  const [favourites, setFavourites] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(
    () => {
      const loggedUser = getUserFromLocalStorage();

      if (loggedUser) {
        setUserId(loggedUser._id);
        const storedFavourites =
          JSON.parse(localStorage.getItem(`${loggedUser._id}-favourites`)) ||
          [];
        setFavourites(storedFavourites);
      } else {
        navigate("/");
      }
    },
    [navigate]
  );

  const handleRemoveFavourite = activity => {
    const updatedFavourites = favourites.filter(fav => fav !== activity);
    setFavourites(updatedFavourites);
    localStorage.setItem(
      `${userId}-favourites`,
      JSON.stringify(updatedFavourites)
    );
  };

  const handleUpdateAccount = async e => {
    e.preventDefault();
    const newEmail = e.target.elements["new-email"].value;
    const newPassword = e.target.elements["new-password"].value;

    try {
      const response = await fetch(`http://localhost:5001/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Account updated successfully!");
      } else {
        alert(`Error updating account: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating account:", error);
      alert("An error occurred while updating the account.");
    }
  };

  const handleDeleteAccount = async e => {
    e.preventDefault();
    const email = e.target.elements["delete-email"].value;
    const password = e.target.elements["delete-password"].value;

    try {
      const response = await fetch("http://localhost:5001/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Account deleted successfully!");

        removeUserFromLocalStorage();
        navigate("/login");
      } else {
        alert(`Error deleting account: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting the account.");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "My Favourites":
        return (
          <div className="favourites-list">
            {favourites.length > 0
              ? favourites.map((activity, index) =>
                  <div key={index} className="favourite-item">
                    <p>
                      {activity}
                    </p>
                    <button
                      className="remove-favourite-button"
                      onClick={() => handleRemoveFavourite(activity)}
                    >
                      <img
                        src={removeIcon}
                        alt="Remove"
                        className="icon-remove"
                      />
                    </button>
                  </div>
                )
              : <p className="content-text-my">
                  No favourite items added yet.
                </p>}
          </div>
        );
      case "Update Account":
        return (
          <div className="update-account-form-container-my">
            <form
              className="update-account-form-my"
              onSubmit={handleUpdateAccount}
            >
              <label htmlFor="new-email" className="form-label-my">
                New Email:
              </label>
              <input
                type="email"
                id="new-email"
                className="form-input-my"
                placeholder="Enter new email"
              />
              <label htmlFor="new-password" className="form-label-my">
                New Password:
              </label>
              <input
                type="password"
                id="new-password"
                className="form-input-my"
                placeholder="Enter new password"
              />
              <button type="submit" className="update-button-my">
                Update
              </button>
            </form>
          </div>
        );
      case "Delete Account":
        return (
          <div className="delete-account-form-container-my">
            <p className="content-text-my">
              Warning: Account deletion is final and irreversible!
            </p>
            <form
              className="delete-account-form-my"
              onSubmit={handleDeleteAccount}
            >
              <label htmlFor="delete-email" className="form-label-my">
                Email:
              </label>
              <input
                type="email"
                id="delete-email"
                className="form-input-my"
                placeholder="Enter your email"
              />
              <label htmlFor="delete-password" className="form-label-my">
                Password:
              </label>
              <input
                type="password"
                id="delete-password"
                className="form-input-my"
                placeholder="Enter your password"
              />
              <button type="submit" className="delete-button-my">
                Delete
              </button>
            </form>
            <button
              className="back-button-my"
              onClick={() => navigate("/weather")}
            >
              Back to Recommendations
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="my-account-container-my">
      <NavBar />
      <div className="account-body-my">
        <div className="sidebar-my">
          <button
            className={`sidebar-button-my ${activeSection === "My Favourites"
              ? "active-my"
              : ""}`}
            onClick={() => setActiveSection("My Favourites")}
          >
            <img src={heartIcon} alt="heart icon" className="icon-my" />
            My Favourites
          </button>
          <button
            className={`sidebar-button-my ${activeSection === "Update Account"
              ? "active-my"
              : ""}`}
            onClick={() => setActiveSection("Update Account")}
          >
            <img src={updateIcon} alt="update icon" className="icon-my" />
            Update Account
          </button>
          <button
            className={`sidebar-button-my ${activeSection === "Delete Account"
              ? "active-my"
              : ""}`}
            onClick={() => setActiveSection("Delete Account")}
          >
            <img src={removeIcon} alt="remove icon" className="icon-my" />
            Delete Account
          </button>
          <button
            className="sidebar-button-my"
            onClick={() => navigate("/weather")}
          >
            <img src={leftIcon} alt="left icon" className="icon-my" />
            Back to Recommendations
          </button>
        </div>
        <div className="content-my">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAccount;
