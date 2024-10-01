const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt"); // Import bcrypt for password comparison
require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const loginUser = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { email, password } = req.body;

  try {
    await client.connect();
    const db = client.db("Capstone_Proj");

    // Find the user by email
    const user = await db.collection("UserAccount").findOne({ email });

    if (user) {
      // Compare the provided password with the stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        res
          .status(200)
          .json({ status: 200, message: "Login successful", data: user });
      } else {
        res.status(401).json({ status: 401, message: "Invalid password" });
      }
    } else {
      res.status(404).json({ status: 404, message: "User not found" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  } finally {
    await client.close();
  }
};

module.exports = { loginUser };
