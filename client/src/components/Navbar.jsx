import React from "react"; // Importing React
import { Link } from "react-router-dom"; // Importing Link for navigation

// Define the Navbar component
function Navbar(props) {
  const { logout } = props; // Destructuring logout function from props

  return (
    <div id="navbar">
      {" "}
      {/* Main container for the navbar */}
      <Link to="/profile">
        {" "}
        {/* Link to the Profile page */}
        <button>Profile</button> {/* Button for Profile */}
      </Link>
      <Link to="/public">
        {" "}
        {/* Link to the Public page */}
        <button>Public</button> {/* Button for Public */}
      </Link>
      <Link to="/">
        {" "}
        {/* Link to the Home page */}
        <button onClick={logout}>Logout</button>{" "}
        {/* Logout button that calls logout on click */}
      </Link>
    </div>
  );
}

export default Navbar; // Exporting the Navbar component
