// Import the mongoose library for database interactions
const mongoose = require("mongoose");
// Extract the Schema constructor from mongoose
const Schema = mongoose.Schema;

// Define a new schema for the "Issue" model
const issueSchema = new Schema({
  title: {
    type: String, // The title of the issue
    required: true, // This field is required
  },

  description: {
    type: String, // A description of the issue
    required: true, // This field is required
  },
  imgUrl: {
    type: String, // URL for an image associated with the issue (optional)
  },
  userId: {
    type: Schema.Types.ObjectId, // Reference to the user who created the issue
    ref: "User", // Link to the "User" model
  },

  username: {
    type: String, // The username of the user who created the issue
    required: true, // This field is required
  },
  createdAt: {
    type: Date, // Timestamp for when the issue was created
    default: Date.now, // Default value is the current date and time
  },
  upvotes: [
    {
      type: Schema.Types.ObjectId, // References to users who upvoted the issue
      ref: "User", // Link to the "User" model
    },
  ],
  downvotes: [
    {
      type: Schema.Types.ObjectId, // References to users who downvoted the issue
      ref: "User", // Link to the "User" model
    },
  ],
});

// Export the Issue model, based on the issueSchema
module.exports = mongoose.model("Issue", issueSchema);
