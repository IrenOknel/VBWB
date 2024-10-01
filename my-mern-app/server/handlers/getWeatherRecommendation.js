"use strict";

const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// fetch weather recommendation by weather_condition
const getWeatherRecommendation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { weather_condition } = req.params; 
  try {
    await client.connect();
    const db = client.db("Capstone_Proj");
    const recommendation = await db
      .collection("WeatherRecommendations")
      .findOne({ weather_condition });
    if (recommendation) {
      res.status(200).json({ status: 200, recommendation });
    } else {
      res.status(404).json({
        status: 404,
        message: "Recommendation not found for the specified weather condition"
      });
    }
  } catch (error) {
    console.error("Error retrieving recommendation:", error);
    res
      .status(500)
      .json({ status: 500, error: "Failed to retrieve recommendation" });
  } finally {
    await client.close();
  }
};

module.exports = { getWeatherRecommendation };
