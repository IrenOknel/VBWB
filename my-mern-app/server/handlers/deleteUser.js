"use strict";

const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const deleteUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Email and password are required" });
  }

  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("Capstone_Proj");

    const user = await db.collection("UserAccount").findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(404).json({
        status: 404,
        message: "User not found or incorrect credentials"
      });
    }

    const result = await db.collection("UserAccount").deleteOne({ email });

    if (result.deletedCount === 1) {
      res
        .status(200)
        .json({ status: 200, message: "User deleted successfully" });
    } else {
      res.status(404).json({
        status: 404,
        message: "User not found or could not be deleted"
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message
    });
  } finally {
    await client.close();
  }
};

module.exports = { deleteUser };
