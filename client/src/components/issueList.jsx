import React from "react";
import PropTypes from "prop-types";
import Issue from "./Issue";

export function IssueList(props) {
  const { issues } = props;

  // Mapping through the issues array to create Issue components
  const issueElements = issues.map((issue) => (
    <Issue {...issue} key={issue._id} /> // Spread issue props
  ));

  // Rendering the list of Issue components
  return <div>{issueElements}</div>;
}

// Prop types validation (optional)
IssueList.propTypes = {
  issues: PropTypes.array.isRequired,
};
