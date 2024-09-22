import React, { useContext, useEffect } from "react"; // Importing React, useContext, and useEffect
import { UserContext } from "../context/UserProvider"; // Importing UserContext for user data and functions
import { IssueList } from "./issueList"; // Importing IssueList component
import IssueForm from "./IssueForm"; // Importing IssueForm component

// Define the Profile component
function Profile() {
  const { user, getUserIssues, issues } = useContext(UserContext); // Destructuring user data and functions from UserContext

  // useEffect to fetch user's issues when the component mounts
  useEffect(() => {
    getUserIssues(); // Calling the function to get user issues
  }, []); // Empty dependency array means this runs once on mount

  console.log(issues); // Logging the issues to the console for debugging

  return (
    <>
      <h1>Username: {user.username}</h1> {/* Displaying the username */}
      <IssueForm /> {/* Rendering the form to add new issues */}
      <IssueList issues={issues} /> {/* Rendering the list of user issues */}
    </>
  );
}

export default Profile; // Exporting the Profile component
