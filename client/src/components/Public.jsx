import React, { useContext, useEffect } from "react"; // Importing React, useContext, and useEffect
import { UserContext } from "../context/UserProvider"; // Importing UserContext for accessing public issues and functions
import { IssueList } from "./issueList"; // Importing IssueList component to display issues
import IssueForm from "./IssueForm"; // Importing IssueForm component to add new issues

// Define the Public component
function Public() {
  const { getPublicIssues, publicIssues } = useContext(UserContext); // Destructuring the function and state from UserContext

  // useEffect to fetch public issues when the component mounts
  useEffect(() => {
    getPublicIssues(); // Calling the function to get public issues
  }, []); // Empty dependency array means this runs once on mount

  console.log(publicIssues); // Logging the public issues to the console for debugging

  return (
    <>
      <h1>Public Issues</h1> {/* Displaying the heading for public issues */}
      {/* Include the IssueForm if you want users to add new issues */}
      <IssueForm /> {/* Rendering the form to add new issues */}
      <IssueList issues={publicIssues} />{" "}
      {/* Rendering the list of public issues */}
    </>
  );
}

export default Public; // Exporting the Public component
