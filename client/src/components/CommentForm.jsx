// import { useState, useContext } from "react";
// import { UserContext } from "../context/UserProvider";

// export default function CommentForm({ issueId }) {
//   // Define initial state for the comment form
//   const initState = {
//     commentText: "", // You can add more fields if needed in the future
//   };

//   const [formData, setFormData] = useState(initState);
//   const { user, addComment } = useContext(UserContext);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value, // Update the formData dynamically by field name
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.commentText.trim() === "") {
//       alert("Comment cannot be empty");
//       return;
//     }
//     addComment(issueId, { text: formData.commentText, userId: user._id });
//     setFormData(initState); // Reset the form after submission
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <textarea
//         name="commentText" // Name for the controlled input
//         value={formData.commentText} // Access value from formData state
//         onChange={handleChange} // Handle input changes
//         placeholder="Write a comment..."
//         required
//       />
//       <button type="submit">Add Comment</button>
//     </form>
//   );
// }
