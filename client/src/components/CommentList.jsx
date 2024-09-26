import React from "react";
import PropTypes from "prop-types";
import Comment from "./Comments";

// Define the CommentList component
export function CommentList({ comments = [] }) {
  // Mapping through the comments array to create individual Comment components
  const commentElements = comments
    .filter((comment) => comment && comment._id) // Ensure each comment is valid
    .map((comment) => <Comment {...comment} key={comment._id} />);

  // Rendering the list of comments
  return <div>{commentElements}</div>;
}

// Prop types validation
CommentList.propTypes = {
  comments: PropTypes.array.isRequired, // Validate that comments is an array
};

// Export the CommentList component as default
export default CommentList;
