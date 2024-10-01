const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const createUser = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: 400,
      message: "Name, email, and password are required."
    });
  }

  try {
    await client.connect();
    const db = client.db("Capstone_Proj");

    const existingUser = await db.collection("UserAccount").findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ status: 409, message: "Email already exists." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await db
      .collection("UserAccount")
      .insertOne({ name, email, password: hashedPassword });

    res.status(201).json({
      status: 201,
      data: { _id: result.insertedId, name, email },
      message: "User added successfully"
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ status: 500, message: "Internal server error" });
  } finally {
    await client.close();
  }
};

module.exports = { createUser };
