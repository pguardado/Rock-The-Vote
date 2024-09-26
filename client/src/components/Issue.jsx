import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import "./Issue.css";

export default function Issue({
  title,
  description,
  imgUrl,
  userId,
  username,
  _id,
  upvotes = [],
  downvotes = [],
  comments = [],
}) {
  const {
    user,
    handleUpVote,
    handleDownVote,
    editIssue,
    deleteIssue,
    addComment,
    getCommentsByIssue,
  } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [voteStatus, setVoteStatus] = useState(null);
  const [issueComments, setIssueComments] = useState(comments);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description);

  const location = useLocation();

  useEffect(() => {
    if (upvotes.includes(user?._id)) {
      setVoteStatus("up");
    } else if (downvotes.includes(user?._id)) {
      setVoteStatus("down");
    }
  }, [upvotes, downvotes, user]);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = await getCommentsByIssue(_id);
      setIssueComments(commentsData);
    };

    fetchComments();
  }, [_id, getCommentsByIssue]);

  const handleSave = async () => {
    try {
      await editIssue(_id, { title: editTitle, description: editDescription });
      setLocalTitle(editTitle);
      setLocalDescription(editDescription);
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
      setLocalUpvotes((prev) => [...prev, user._id]);
      setLocalDownvotes((prev) => prev.filter((id) => id !== user._id));
    } else if (type === "downvote" && voteStatus !== "down") {
      await handleDownVote(_id);
      setVoteStatus("down");
      setLocalDownvotes((prev) => [...prev, user._id]);
      setLocalUpvotes((prev) => prev.filter((id) => id !== user._id));
    }
  };

  const handleAddComment = async (comment) => {
    const newComment = await addComment(_id, comment); // Add comment via API
    if (newComment) {
      setIssueComments((prevComments) => [...prevComments, newComment]); // Immediately update local state
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
          <h1 className="issue-title">{localTitle}</h1>
          <h4 className="issue-description">{localDescription}</h4>
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
                      Upvote ({localUpvotes.length})
                    </button>
                    <button
                      className="downvote-button"
                      onClick={() => handleVote("downvote")}
                    >
                      Downvote ({localDownvotes.length})
                    </button>
                  </>
                )}
                {voteStatus === "up" && (
                  <p>
                    Upvotes: {localUpvotes.length} | Downvotes:{" "}
                    {localDownvotes.length}
                  </p>
                )}
                {voteStatus === "down" && (
                  <p>
                    Upvotes: {localUpvotes.length} | Downvotes:{" "}
                    {localDownvotes.length}
                  </p>
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
          {location.pathname !== "/profile" && (
            <>
              <CommentList comments={issueComments} />
              <CommentForm issueId={_id} onAddComment={handleAddComment} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
