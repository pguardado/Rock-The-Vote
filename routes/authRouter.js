// Import the express framework for building web applications
const express = require("express");
// Create a new router object for handling authentication routes
const authRouter = express.Router();
// Import the User model for database interactions
const User = require("../models/user");
// Import jsonwebtoken for creating JWTs
const jwt = require("jsonwebtoken");
// Import bcrypt for hashing and comparing passwords
const bcrypt = require("bcrypt");

// Sign-up route for creating a new user
authRouter.post("/signup", async (req, res, next) => {
  try {
    // Check if a user with the provided username already exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      // If the username is taken, respond with a 403 status and an error message
      res.status(403);
      return next(new Error("Username is already taken"));
    }

    // Create a new user instance with the request body
    const newUser = new User(req.body);
    // Save the new user to the database
    const savedUser = await newUser.save();
    // Create a JWT for the new user (excluding password)
    const token = jwt.sign(savedUser.toObject(), process.env.SECRET);
    // Respond with the newly created user (without password) and the token
    return res.status(201).send({ user: savedUser.toObject(), token });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500);
    return next(error);
  }
});

// Login route for authenticating an existing user
authRouter.post("/login", async (req, res, next) => {
  try {
    // Find the user by username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      // If the user is not found, respond with a 403 status and an error message
      res.status(403);
      return next(new Error("Incorrect Username or Password"));
    }
    // Check if the provided password matches the stored password
    const passwordCheck = await user.checkPassword(req.body.password);
    if (!passwordCheck) {
      // If the password is incorrect, respond with a 403 status and an error message
      res.status(403);
      return next(new Error("Incorrect Username or Password"));
    }

    // Create a JWT for the authenticated user (excluding password)
    const token = jwt.sign(user.toObject(), process.env.SECRET);
    // Respond with the user (without password) and the token
    return res.status(200).send({ user: user.toObject(), token });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500);
    return next(error);
  }
});

// Export the authRouter for use in other parts of the application
module.exports = authRouter;
