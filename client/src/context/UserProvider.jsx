import React, { useState, useEffect } from "react";
import axios from "axios";

export const UserContext = React.createContext();

const userAxios = axios.create();

userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function UserProvider(props) {
  const initState = {
    user: JSON.parse(localStorage.getItem("user")) || {},
    token: localStorage.getItem("token") || "",
    issues: [],
    publicIssues: [],
    comments: [], // State for comments
    errMsg: "",
  };

  const [userState, setUserState] = useState(initState);
  const [allIssues, setAllIssues] = useState([]);

  // Fetch issues when component mounts
  useEffect(() => {
    getPublicIssues();
  }, []);

  // Fetch public issues
  async function getPublicIssues() {
    try {
      const res = await axios.get("/api/main/issues/public");
      const issuesWithComments = await Promise.all(
        res.data.map(async (issue) => {
          const commentsRes = await userAxios.get(
            `/api/main/issues/${issue._id}/comments`
          );
          return { ...issue, comments: commentsRes.data || [] }; // Ensure comments is an array
        })
      );
      setUserState((prevState) => ({
        ...prevState,
        publicIssues: issuesWithComments,
      }));
    } catch (error) {
      console.error(
        "Error fetching public issues:",
        error.response?.data || error.message
      );
    }
  }

  // Fetch comments for a specific issue using userAxios (with token)
  async function getCommentsByIssue(issueId) {
    try {
      const res = await userAxios.get(`/api/main/issues/${issueId}/comments`);
      return res.data || []; // Ensure comments is an array
    } catch (error) {
      console.error(
        "Error fetching comments:",
        error.response?.data || error.message
      );
    }
  }

  // Function to add a comment for a specific issue
  async function addComment(issueId, newComment) {
    try {
      const res = await userAxios.post(`/api/main/issues/${issueId}/comments`, {
        text: newComment,
      });

      // Update the specific issue's comments in the userState
      setUserState((prevState) => ({
        ...prevState,
        issues: prevState.issues.map((issue) =>
          issue._id === issueId
            ? { ...issue, comments: [...(issue.comments || []), res.data] }
            : issue
        ), // Append the new comment to the correct issue
      }));

      return res.data; // Return the newly added comment
    } catch (error) {
      console.error(
        "Error adding comment:",
        error.response?.data || error.message
      );
    }
  }

  // Function to handle fetching comments for a specific issue
  function fetchComments(issueId) {
    getCommentsByIssue(issueId);
  }

  async function signup(creds) {
    try {
      const res = await axios.post("/api/auth/signup", creds);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserState((prevUserState) => ({
        ...prevUserState,
        user,
        token,
      }));
    } catch (error) {
      handleAuthErr(error.response.data.errMsg);
    }
  }

  async function login(creds) {
    try {
      const res = await axios.post("/api/auth/login", creds);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserState((prevUserState) => ({
        ...prevUserState,
        user,
        token,
      }));
    } catch (error) {
      handleAuthErr(error.response.data.errMsg);
    }
  }

  async function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserState((prevUserState) => ({
      ...prevUserState,
      token: "",
      user: {},
    }));
  }

  function handleAuthErr(errMsg) {
    setUserState((prevUserState) => ({
      ...prevUserState,
      errMsg,
    }));
  }

  function resetAuthErr() {
    setUserState((prevUserState) => ({
      ...prevUserState,
      errMsg: "",
    }));
  }

  async function getUserIssues() {
    try {
      const res = await userAxios.get("/api/main/issues/user");
      setUserState((prevState) => ({
        ...prevState,
        issues: res.data,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async function addIssue(newIssue) {
    try {
      const res = await userAxios.post("/api/main/issues", newIssue);
      setUserState((prevState) => ({
        ...prevState,
        issues: [...prevState.issues, res.data],
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpVote(issueId) {
    try {
      const res = await userAxios.put(`/api/main/issues/upvotes/${issueId}`);
      setAllIssues((prevIssues) =>
        prevIssues.map((issue) => (issue._id === issueId ? res.data : issue))
      );
      setUserState((prevUserState) => ({
        ...prevUserState,
        issues: prevUserState.issues.map((issue) =>
          issue._id === issueId ? res.data : issue
        ),
      }));
      return res.data; // Return the updated issue data
    } catch (error) {
      console.log("Error during upvote:", error);
    }
  }

  async function handleDownVote(issueId) {
    try {
      const res = await userAxios.put(`/api/main/issues/downvotes/${issueId}`);
      setAllIssues((prevIssues) =>
        prevIssues.map((issue) => (issue._id === issueId ? res.data : issue))
      );
      setUserState((prevUserState) => ({
        ...prevUserState,
        issues: prevUserState.issues.map((issue) =>
          issue._id === issueId ? res.data : issue
        ),
      }));
      return res.data; // Return the updated issue data
    } catch (error) {
      console.log(error);
    }
  }

  async function editIssue(issueId, updatedIssue) {
    try {
      const res = await userAxios.put(
        `/api/main/issues/${issueId}`,
        updatedIssue
      );
      setUserState((prevState) => ({
        ...prevState,
        issues: prevState.issues.map((issue) =>
          issue._id === issueId ? res.data : issue
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteIssue(issueId) {
    // Optimistically update the state before making the API call
    setUserState((prevState) => ({
      ...prevState,
      issues: prevState.issues.filter((issue) => issue._id !== issueId),
      publicIssues: prevState.publicIssues.filter(
        (issue) => issue._id !== issueId
      ),
    }));

    try {
      await userAxios.delete(`/api/main/issues/${issueId}`);
    } catch (error) {
      console.log(error);
      // Optionally, you can revert the state update if the API call fails
      setUserState((prevState) => ({
        ...prevState,
        issues: [...prevState.issues, { _id: issueId }],
        publicIssues: [...prevState.publicIssues, { _id: issueId }],
      }));
    }
  }

  return (
    <UserContext.Provider
      value={{
        logout,
        ...userState,
        login,
        signup,
        getUserIssues,
        getPublicIssues,
        addIssue,
        handleAuthErr,
        resetAuthErr,
        handleUpVote,
        handleDownVote,
        editIssue,
        deleteIssue,
        fetchComments, // Expose fetchComments to fetch comments for an issue
        addComment, // Expose addComment to allow adding new comments
        getCommentsByIssue, // Expose getCommentsByIssue to fetch comments for an issue
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
