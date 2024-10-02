import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../utils/apiConfig";
import "./weatherRecommendation.css"; 
import iconLoad from "../assets/iconload.png";
import heartIcon from "../assets/iconheart.png"; 
import dislikeIcon from "../assets/icon2heart.png"; 
import { getUserFromLocalStorage } from "../utils/localStorageHelper"; 

const WeatherRecommendation = ({ weather }) => {
  const [activities, setActivities] = useState([]);
  const [favourites, setFavourites] = useState([]); 

  useEffect(() => {
    if (weather) {
      const fetchRecommendations = async () => {
        const condition = weather.weather[0].main;
        try {
          const response = await axios.get(
            `${API_URL}/api/recommendation/${condition}`
          );
          setActivities(response.data.recommendation.activities || []);
        } catch (error) {
          console.error("Error fetching weather recommendations:", error);
        }
      };
      fetchRecommendations();
    }

    // Loading favourite activities from local storage when component mounts
    const user = getUserFromLocalStorage();
    if (user) {
      const storedFavourites =
        JSON.parse(localStorage.getItem(`${user._id}-favourites`)) || [];
      setFavourites(storedFavourites);
    }
  }, [weather]);

  // Adding recommendation to favourites
  const handleLike = (activity) => {
    const user = getUserFromLocalStorage();
    if (user) {
      const updatedFavourites = [...favourites, activity];
      setFavourites(updatedFavourites);
      localStorage.setItem(
        `${user._id}-favourites`,
        JSON.stringify(updatedFavourites)
      ); 
    }
  };

  // Removing recommendation from favourites
  const handleDislike = (activity) => {
    const user = getUserFromLocalStorage();
    if (user) {
      const updatedFavourites = favourites.filter((fav) => fav !== activity);
      setFavourites(updatedFavourites);
      localStorage.setItem(
        `${user._id}-favourites`,
        JSON.stringify(updatedFavourites)
      );
    }
  };

  return (
    <div className="weather-recommendation">
      <h3>
        <img src={iconLoad} alt="Icon" className="icon-image" />
        Recommended Activities:
      </h3>
      <div className="activity-list">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="activity-card">
              <p>{activity}</p>
              <div className="action-buttons">
                {!favourites.includes(activity) ? (
                  <button
                    className="like-button"
                    onClick={() => handleLike(activity)}
                  >
                    <img src={heartIcon} alt="Like" className="icon-like" />
                  </button>
                ) : (
                  <button
                    className="dislike-button"
                    onClick={() => handleDislike(activity)}
                  >
                    <img
                      src={dislikeIcon}
                      alt="Dislike"
                      className="icon-dislike"
                    />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No recommendations available for this weather condition.</p>
        )}
      </div>
    </div>
  );
};

export default WeatherRecommendation;