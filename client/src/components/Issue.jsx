import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import "./Issue.css";

export default function Issue(props) {
  const {
    title,
    description,
    imgUrl,
    userId,
    username,
    _id,
    upvotes = [], // Default to empty array if undefined
    downvotes = [], // Default to empty array if undefined
  } = props;

  const { user, handleUpVote, handleDownVote, editIssue, deleteIssue } =
    useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [voteStatus, setVoteStatus] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (upvotes.includes(user?._id)) {
      setVoteStatus("up");
    } else if (downvotes.includes(user?._id)) {
      setVoteStatus("down");
    }
  }, [upvotes, downvotes, user]);

  const handleSave = async () => {
    try {
      const updatedIssue = { title: editTitle, description: editDescription };
      await editIssue(_id, updatedIssue);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving the issue:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIssue(_id);
    } catch (error) {
      console.error("Error deleting the issue:", error);
    }
  };

  const isUser = user && userId === user._id;

  const handleVote = async (type) => {
    if (type === "upvote" && voteStatus !== "up") {
      await handleUpVote(_id);
      setVoteStatus("up");
    } else if (type === "downvote" && voteStatus !== "down") {
      await handleDownVote(_id);
      setVoteStatus("down");
    }
  };

  return (
    <div className="issue-container">
      <h1 className="issue-username">{username}</h1>
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-title-input"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="edit-description-textarea"
          />
          <div className="button-group">
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="issue-title">{title}</h1>
          <h4 className="issue-description">{description}</h4>
          {imgUrl && <img className="issue-image" src={imgUrl} alt="Issue" />}
          <div className="button-group">
            {location.pathname !== "/profile" && (
              <>
                {!voteStatus && (
                  <>
                    <button
                      className="upvote-button"
                      onClick={() => handleVote("upvote")}
                    >
                      Upvote ({upvotes.length})
                    </button>
                    <button
                      className="downvote-button"
                      onClick={() => handleVote("downvote")}
                    >
                      Downvote ({downvotes.length})
                    </button>
                  </>
                )}
                {voteStatus === "up" && (
                  <>
                    <p>Upvotes: {upvotes.length + 1}</p>
                    <p>Downvotes: {downvotes.length}</p>
                  </>
                )}
                {voteStatus === "down" && (
                  <>
                    <p>Upvotes: {upvotes.length}</p>
                    <p>Downvotes: {downvotes.length + 1}</p>
                  </>
                )}
              </>
            )}
            {isUser && (
              <div className="edit-delete-buttons">
                <button
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button className="delete-button" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
