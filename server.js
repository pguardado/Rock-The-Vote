const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const { expressjwt } = require("express-jwt");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to db");
  } catch (error) {
    console.log(error);
  }
}
connectToDb();

// JWT middleware
const jwtMiddleware = expressjwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
}).unless({
  path: [
    "/api/auth/signup",
    "/api/auth/login",
    "/api/main/issues/public",
    {
      url: /^\/api\/main\/issues\/[a-fA-F0-9]{24}\/comments$/,
      methods: ["GET"],
    },
  ],
});

// Apply JWT middleware
app.use(jwtMiddleware);

// Log request paths
app.use((req, res, next) => {
  console.log("Request path:", req.path);
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRouter"));
app.use("/api/main/issues", require("./routes/issueRouter"));
app.use("/api/main/issues", require("./routes/commentRouter"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === "UnauthorizedError") {
    res.status(401).send({ errMsg: "Unauthorized access" });
  } else {
    res.status(500).send({ errMsg: err.message });
  }
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
