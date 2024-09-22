// Import the mongoose library for database interactions
const mongoose = require("mongoose");
// Extract the Schema constructor from mongoose
const Schema = mongoose.Schema;
// Import bcrypt for password hashing
const bcrypt = require("bcrypt");

// Define a new schema for the "User" model
const userSchema = new Schema({
  username: {
    type: String, // The username of the user
    unique: true, // Each username must be unique
    required: true, // This field is required
  },
  password: {
    type: String, // The user's password
    required: true, // This field is required
  },
  isAdmin: {
    type: Boolean, // Indicates if the user is an admin
    default: false, // Default value is false
  },
  memberSince: {
    type: Date, // Timestamp for when the user joined
    default: Date.now, // Default value is the current date and time
  },
});

// Middleware to hash the password before saving the user
userSchema.pre("save", async function (next) {
  const user = this; // Reference to the user being saved
  // Check if the password field has been modified
  if (user.isModified("password")) {
    try {
      // Hash the password with bcrypt
      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash; // Store the hashed password
    } catch (error) {
      return next(error); // Pass the error to the next middleware
    }
  }
  next(); // Proceed to the next middleware
});

// Method to check if a given password matches the stored hashed password
userSchema.methods.checkPassword = async function (passwordAttempt) {
  try {
    // Compare the provided password attempt with the stored hashed password
    return bcrypt.compare(passwordAttempt, this.password);
  } catch (error) {
    throw error; // Throw error if comparison fails
  }
};

// Method to return user object without the password field
userSchema.methods.withoutPassword = function () {
  const user = this.toObject(); // Convert mongoose document to plain JavaScript object
  delete user.password; // Remove the password field
  return user; // Return the user object without the password
};

// Export the User model, based on the userSchema
module.exports = mongoose.model("User", userSchema);
