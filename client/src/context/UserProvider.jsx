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
    errMsg: "",
  };

  const [userState, setUserState] = useState(initState);
  const [allIssues, setAllIssues] = useState([]);

  useEffect(() => {
    getPublicIssues();
  }, []);

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
    try {
      await userAxios.delete(`/api/main/issues/${issueId}`);
      setUserState((prevState) => ({
        ...prevState,
        issues: prevState.issues.filter((issue) => issue._id !== issueId),
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async function getPublicIssues() {
    try {
      const res = await axios.get("/api/main/issues/public");
      setAllIssues(res.data);
      setUserState((prevState) => ({
        ...prevState,
        publicIssues: res.data,
      }));
    } catch (error) {
      console.error(
        "Error fetching public issues:",
        error.response?.data || error.message
      );
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
        allIssues,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
