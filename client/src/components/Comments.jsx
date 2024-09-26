import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import "./Comment.css";

export default function Comment(props) {
  const { text, username } = props;

  const { user } = useContext(UserContext);

  return (
    <div className="comment-container">
      <h1 className="comment-username">{username}</h1>
      <h4 className="comment-text">{text}</h4>
    </div>
  );
}
