const { MongoClient } = require("mongodb");
const fs = require("fs");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.error(
    "Mongo URI not found. Make sure the .env file is properly configured."
  );
  process.exit(1);
}

const options = {};

const batchImport = async () => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("Capstone_Proj");
    console.log("Connected to MongoDB");

    let userAccounts = JSON.parse(
      fs.readFileSync("./data/UserAccount.json", "utf-8")
    );

    const saltRounds = 10;
    for (let user of userAccounts) {
      user.password = await bcrypt.hash(user.password, saltRounds);
    }

    await db.collection("UserAccount").deleteMany({});
    const userResult = await db
      .collection("UserAccount")
      .insertMany(userAccounts);
    console.log(
      "UserAccount data imported successfully:",
      userResult.insertedCount,
      "documents inserted."
    );

    let weatherRecommendations = JSON.parse(
      fs.readFileSync("./data/WeatherRecommendations.json", "utf-8")
    );

    if (!Array.isArray(weatherRecommendations)) {
      throw new Error(
        "WeatherRecommendations data is not an array of documents."
      );
    }

    await db.collection("WeatherRecommendations").deleteMany({});
    const weatherResult = await db
      .collection("WeatherRecommendations")
      .insertMany(weatherRecommendations);
    console.log(
      "WeatherRecommendations data imported successfully:",
      weatherResult.insertedCount,
      "documents inserted."
    );
  } catch (error) {
    console.error("Error importing data:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
};

batchImport();
