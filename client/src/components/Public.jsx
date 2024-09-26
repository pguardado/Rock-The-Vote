import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserProvider";
import { IssueList } from "./IssueList";
import IssueForm from "./IssueForm";

function Public() {
  const { getPublicIssues, publicIssues } = useContext(UserContext);

  useEffect(() => {
    getPublicIssues();
  }, []);

  return (
    <>
      <h1>Public Issues</h1>
      <IssueForm />
      <IssueList issues={publicIssues} />
    </>
  );
}

export default Public;
