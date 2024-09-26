// routes/commentRouter.js
const express = require("express");
const Comment = require("../models/comment");
const commentRouter = express.Router();

// Middleware to parse JSON request bodies
commentRouter.use(express.json());

// Create a new comment
commentRouter.post("/:issueId/comments", async (req, res, next) => {
  try {
    req.body.username = req.auth.username;
    req.body.userId = req.auth._id;
    const { text } = req.body;
    const { issueId } = req.params;

    if (!text || !issueId) {
      return res.status(400).send({ errMsg: "Text and issueId are required" });
    }

    if (typeof text !== "string") {
      return res.status(400).send({ errMsg: "Text must be a string" });
    }

    const newComment = new Comment({
      text,
      issueId,
      userId: req.body.userId,
      username: req.body.username,
    });
    const savedComment = await newComment.save();
    return res.status(201).send(savedComment);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

// Update a comment
// Update the comment using both issueId and commentId in the URL
commentRouter.put("/:issueId/comments/:commentId", async (req, res, next) => {
  try {
    const updatedComment = await Comment.findOneAndUpdate(
      {
        _id: req.params.commentId,
        issueId: req.params.issueId,
        userId: req.auth._id,
      },
      req.body,
      { new: true }
    );

    if (!updatedComment) {
      res.status(403);
      return next(new Error("Not authorized to update this comment"));
    }
    return res.status(200).send(updatedComment);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

// Get comments for a specific issue
commentRouter.get("/:issueId/comments", async (req, res, next) => {
  try {
    const comments = await Comment.find({ issueId: req.params.issueId });
    return res.status(200).send(comments);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

// Delete a comment
commentRouter.delete(
  "/:issueId/comments/:commentId",
  async (req, res, next) => {
    try {
      const deletedComment = await Comment.findOneAndDelete({
        _id: req.params.commentId,
        issueId: req.params.issueId,
        userId: req.auth._id,
      });

      if (!deletedComment) {
        res.status(403);
        return next(new Error("Not authorized to delete this comment"));
      }
      return res.status(200).send({ message: "Comment deleted" });
    } catch (error) {
      res.status(500);
      return next(error);
    }
  }
);

module.exports = commentRouter;
