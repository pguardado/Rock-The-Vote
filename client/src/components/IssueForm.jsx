import { useState, useContext } from "react"; // Importing useState and useContext hooks
import { UserContext } from "../context/UserProvider"; // Importing UserContext for accessing context

export default function IssueForm() {
  const { addIssue } = useContext(UserContext); // Accessing addIssue function from UserContext

  const initState = {
    // Initial state for form data
    title: "", // Initial title
    description: "", // Initial description
    imgUrl: "", // Initial image URL
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
  function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission behavior
    addIssue(formData); // Call addIssue function with form data
    setFormData(initState); // Reset form data to initial state after submission
  }

  return (
    <form onSubmit={handleSubmit}>
      {" "}
      {/* Form element with onSubmit handler */}
      <input
        name="title" // Name attribute for title input
        value={formData.title} // Controlled input value from state
        onChange={handleChange} // Handler for input change
        placeholder="Title" // Optional placeholder for better UX
      />
      <input
        name="description" // Name attribute for description input
        value={formData.description} // Controlled input value from state
        onChange={handleChange} // Handler for input change
        placeholder="Description" // Optional placeholder for better UX
      />
      <input
        name="imgUrl" // Name attribute for image URL input
        value={formData.imgUrl} // Controlled input value from state
        onChange={handleChange} // Handler for input change
        placeholder="Image URL" // Optional placeholder for better UX
      />
      <button>Submit</button> {/* Submit button for the form */}
    </form>
  );
}
