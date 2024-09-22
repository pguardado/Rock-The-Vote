// import { useContext, useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { UserContext } from "../context/UserProvider";
// import axios from "axios";
// import "./Comments.css";

// export default function Comments({ issueId }) {
//   const [comments, setComments] = useState([]); // State to store comments
//   const [newComment, setNewComment] = useState(""); // State to store new comment text
//   const { user, addComment } = useContext(UserContext); // Get user and addComment from context

//   const location = useLocation(); // Get the current location

//   // Fetch comments for the specific issue
//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const res = await axios.get(`/api/main/comments/issue/${issueId}`);
//         setComments(res.data.comments);
//       } catch (err) {
//         console.error("Error fetching comments:", err);
//       }
//     };
//     fetchComments();
//   }, [issueId]);

//   // Function to handle adding a new comment
//   const handleAddComment = async (e) => {
//     e.preventDefault();
//     if (!user) {
//       alert("You must be logged in to add a comment.");
//       return;
//     }

//     try {
//       const commentData = { text: newComment, issueId, userId: user._id };
//       await addComment(commentData); // Ensure addComment handles adding the comment
//       setComments((prevComments) => [...prevComments, commentData]);
//       setNewComment(""); // Clear input field
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       alert("There was an error adding your comment. Please try again.");
//     }
//   };

//   return (
//     <div className="comments-container">
//       <h3>Comments</h3>
//       {comments.length > 0 ? (
//         comments.map((comment) => (
//           <div key={comment._id} className="comment">
//             <p>
//               <strong>{comment.userId.username}</strong>: {comment.text}
//             </p>
//           </div>
//         ))
//       ) : (
//         <p>No comments yet. Be the first to comment!</p>
//       )}
//       {user && (
//         <form onSubmit={handleAddComment} className="comment-form">
//           <input
//             type="text"
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="Add a comment"
//             required
//             className="comment-input"
//           />
//           <button type="submit" className="comment-submit-button">
//             Post
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }
