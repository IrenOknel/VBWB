"use strict";

const express = require("express");
const morgan = require("morgan");

const { createUser } = require("./handlers/createUser");
const { loginUser } = require("./handlers/loginUser");
const { updateUser } = require("./handlers/updateUser");
const { deleteUser } = require("./handlers/deleteUser");
const {
  getWeatherRecommendation
} = require("./handlers/getWeatherRecommendation");
const cors = require("cors");

const PORT = 5001;

const app = express();
app.use(cors());
app.use(express.json());

app
  .use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("./server/assets"))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"));

// User Routes
app.post("/api/signup", createUser);
app.post("/api/login", loginUser);
app.put("/update/:id", updateUser);
app.delete("/delete", deleteUser);
app.get("/api/recommendation/:weather_condition", getWeatherRecommendation);

app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
