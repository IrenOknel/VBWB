const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { email, password } = req.body;

  const isObjectId = ObjectId.isValid(userId);
  let query;

  if (isObjectId) {
    query = { _id: new ObjectId(userId) };
  } else if (!isNaN(userId)) {
    query = { _id: parseInt(userId) };
  } else {
    return res
      .status(400)
      .json({ status: 400, message: "Invalid user ID format." });
  }

  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("Capstone_Proj");

    const saltRounds = 10;
    const newValues = {
      $set: {
        email,
        ...(password && { password: await bcrypt.hash(password, saltRounds) }) // Hash for password
      }
    };

    const result = await db
      .collection("UserAccount")
      .updateOne(query, newValues);

    if (result.matchedCount === 0) {
      return res.status(404).json({ status: 404, message: "User not found." });
    }

    return res
      .status(200)
      .json({ status: 200, message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message
    });
  } finally {
    await client.close();
  }
};

module.exports = { updateUser };
