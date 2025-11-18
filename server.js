const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");

const PORT = 5050;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for parsing JSON bodies
app.use(express.static("public"));

// MongoDB connection
const MONGO_URL = "mongodb://admin:qwerty@mongo:27017"; // Use container name 'mongo'
const client = new MongoClient(MONGO_URL);
let db;

async function startServer() {
  try {
    // Connect to MongoDB once
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // Use your database
    db = client.db("apnacollege-db");

    // GET all users
    app.get("/getUsers", async (req, res) => {
      try {
        const data = await db.collection("users").find({}).toArray();
        res.json(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Error fetching users");
      }
    });

    // POST new user
    app.post("/addUser", async (req, res) => {
      try {
        const userObj = req.body;
        const result = await db.collection("users").insertOne(userObj);
        console.log("User inserted:", result.insertedId);
        res.json(result);
      } catch (err) {
        console.error("Error inserting user:", err);
        res.status(500).send("Error inserting user");
      }
    });

    // Start Express server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit container if MongoDB connection fails
  }
}

startServer();