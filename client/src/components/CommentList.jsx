// import React from "react";
// import PropTypes from "prop-types";

// // Define the CommentList component
// export function CommentList({ comments }) {
//   // Mapping through the comments array to create individual comment elements
//   const commentElements = comments.map((comment) => (
//     <div key={comment._id} className="comment">
//       <p>
//         <strong>{comment.userId.username}</strong>: {comment.text}
//       </p>
//     </div>
//   ));

//   // Rendering the list of comments
//   return (
//     <div className="comments-container">
//       <h3>Comments</h3>
//       {comments.length > 0 ? (
//         commentElements
//       ) : (
//         <p>No comments yet. Be the first to comment!</p>
//       )}
//     </div>
//   );
// }

// // Prop types validation
// CommentList.propTypes = {
//   comments: PropTypes.array.isRequired, // Validate that comments is an array
// };
