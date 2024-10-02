const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { createUser } = require("./handlers/createUser");
const { loginUser } = require("./handlers/loginUser");
const { updateUser } = require("./handlers/updateUser");
const { deleteUser } = require("./handlers/deleteUser");
const {
  getWeatherRecommendation
} = require("./handlers/getWeatherRecommendation");

const PORT = process.env.PORT || 5001;

const app = express();

// Enable CORS for frontend to connect to the backend
app.use(
  cors({
    origin: "*", // You can restrict this to your frontend URL for more security
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Headers"
    ]
  })
);

app.use(express.json());
app.use(morgan("tiny"));

// Serve static files from the assets directory
app.use(express.static("./server/assets"));

// API Endpoints
app.post("/api/signup", createUser);
app.post("/api/login", loginUser);
app.put("/update/:id", updateUser);
app.delete("/delete", deleteUser);
app.get("/api/recommendation/:weather_condition", getWeatherRecommendation);

// Catch-all route for serving the backend root URL
app.use("/", express.static(__dirname + "/"));

// Start the server
app.listen(PORT, () => console.info(`Server running on port ${PORT}`));
