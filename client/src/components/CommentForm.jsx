import { useState, useContext } from "react"; // Importing useState and useContext hooks
import { UserContext } from "../context/UserProvider"; // Importing UserContext for accessing context

export default function CommentForm({ issueId, onAddComment }) {
  const { addComment } = useContext(UserContext); // Accessing addComment function from UserContext

  const initState = {
    // Initial state for form data
    commentText: "", // Initial comment text
  };

  const [formData, setFormData] = useState(initState); // State to manage form data

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target; // Get name and value from event target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the corresponding field in state
    }));
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.commentText.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    console.log("Submitting Comment:", formData.commentText); // Log the value

    try {
      const newComment = await addComment(
        issueId,
        String(formData.commentText)
      );
      onAddComment(newComment);
      setFormData(initState);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {" "}
      {/* Form element with onSubmit handler */}
      <textarea
        name="commentText" // Name attribute for comment text input
        value={formData.commentText} // Controlled input value from state
        onChange={handleChange} // Handler for input change
        placeholder="Write a comment..." // Optional placeholder for better UX
        required
      />
      <button type="submit">Add Comment</button>{" "}
      {/* Submit button for the form */}
    </form>
  );
}
