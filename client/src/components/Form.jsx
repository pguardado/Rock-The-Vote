import React, { useState } from "react"; // Importing React and useState

function Form(props) {
  const initState = { username: "", password: "" }; // Initial state for form data
  const [formData, setFormData] = useState(initState); // State to manage form data

  const { isMember, submit, errMsg } = props; // Destructuring props to get isMember, submit function, and error message

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
    submit(formData); // Call the submit function passed in as props with form data
  }

  return (
    <form name="auth-form" id="auth-form" onSubmit={handleSubmit}>
      {" "}
      {/* Form element with onSubmit handler */}
      <h2>Welcome to RTV!</h2> {/* Welcome heading */}
      <input
        placeholder="username" // Placeholder for username input
        name="username" // Name attribute for input
        value={formData.username} // Controlled input value from state
        onChange={handleChange} // Handler for input change
      />
      <input
        type="password" // Set type to password for secure input
        placeholder="password" // Placeholder for password input
        name="password" // Name attribute for input
        value={formData.password} // Controlled input value from state
        onChange={handleChange} // Handler for input change
      />
      <button>{isMember ? "Login" : "Signup"}</button>{" "}
      {/* Conditional button text based on isMember */}
      <p style={{ color: "red" }}>{errMsg}</p>{" "}
      {/* Display error message if any */}
    </form>
  );
}

export default Form; // Exporting the Form component for use in other parts of the application
