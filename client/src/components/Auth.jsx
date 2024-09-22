import React, { useState, useContext } from "react"; // Importing React and hooks
import Form from "./Form"; // Importing the Form component
import { UserContext } from "../context/UserProvider"; // Importing UserContext

function Auth() {
  // Destructure context values
  const { login, signup, errMsg, resetAuthErr } = useContext(UserContext);
  const [isMember, setIsMember] = useState(false); // State to toggle between login and signup

  // Function to toggle the form between login and signup
  const toggleForm = () => {
    setIsMember(!isMember); // Switch the state
    resetAuthErr(); // Reset any error messages
  };

  return (
    <div id="auth-div">
      {isMember ? (
        // If the user is a member, show the login form
        <>
          <Form isMember={isMember} submit={login} errMsg={errMsg} />
          <button onClick={toggleForm}>Create an Account?</button>
        </>
      ) : (
        // If the user is not a member, show the signup form
        <>
          <Form isMember={isMember} submit={signup} errMsg={errMsg} />
          <button onClick={toggleForm}>Already a Member?</button>
        </>
      )}
    </div>
  );
}

export default Auth; // Exporting the Auth component
