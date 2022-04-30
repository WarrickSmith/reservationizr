const port = process.env.PORT || 5000;
const dbPort = 27017;
const app = require("./app");
const mongoose = require("mongoose");
const dbURI = process.env.MONGO_URI || `mongodb://localhost:${dbPort}/mongo`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);

    // When successfully connected - initial connection
    console.log(
      "\x1b[36m%s\x1b[0m",
      `Mongoose default connection is open to: ${dbURI}`
    );

    // When successfully connected - Subsequent connections
    mongoose.connection.on("connected", () => {
      console.log(
        "\x1b[36m%s\x1b[0m",
        `Mongoose default connection is open to: ${dbURI}`
      );
    });

    // When the connection is disconnected
    mongoose.connection.on("disconnected", () => {
      console.log(
        "\x1b[33m%s\x1b[0m",
        `Mongoose default connection disconnected from: ${dbURI}`
      );
    });
  } catch (err) {
    // Show error if no initial connection to the MongoDb can be established
    console.log(
      "\x1b[31m%s\x1b[0m",
      "Error connecting to MongooDB. Please check database is running and available."
    );
  }
};

// Initiate MongoDB connection
connectDB();

app.listen(port, () => {
  console.log("\x1b[32m", `API server started at http://localhost:${port}`);
});
