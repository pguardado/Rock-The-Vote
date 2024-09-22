// const express = require("express");
// const commentRouter = express.Router();
// const Comment = require("../models/comment");

// // Route to get all comments (protected route)
// commentRouter.get("/", async (req, res, next) => {
//   try {
//     const comments = await Comment.find();
//     return res.status(200).send(comments);
//   } catch (error) {
//     res.status(500);
//     return next(error);
//   }
// });

// // Get comments for a specific issue (public route)
// commentRouter.get("/issue/:issueId", async (req, res, next) => {
//   try {
//     const comments = await Comment.find({
//       issueId: req.params.issueId,
//     }).populate("userId", "username");
//     res.status(200).send({ issueId: req.params.issueId, comments });
//   } catch (error) {
//     res.status(500);
//     return next(error);
//   }
// });

// // Create a new comment (protected route)
// commentRouter.post("/", async (req, res, next) => {
//   try {
//     req.body.username = req.auth.username;
//     req.body.userId = req.auth._id;

//     const newComment = new Comment(req.body);
//     const savedComment = await newComment.save();
//     return res.status(201).send(savedComment);
//   } catch (error) {
//     res.status(500);
//     return next(error);
//   }
// });

// // Update a comment (protected route)
// commentRouter.put("/:commentId", async (req, res, next) => {
//   try {
//     const comment = await Comment.findOne({
//       _id: req.params.commentId,
//       userId: req.auth._id,
//     });
//     if (!comment) {
//       res.status(403);
//       return next(new Error("You can only edit your own comments"));
//     }
//     comment.text = req.body.text || comment.text;
//     const updatedComment = await comment.save();
//     return res.status(200).send(updatedComment);
//   } catch (error) {
//     res.status(500);
//     return next(error);
//   }
// });

// // Delete a comment (protected route)
// commentRouter.delete("/:commentId", async (req, res, next) => {
//   try {
//     const deleteComment = await Comment.findOneAndDelete({
//       _id: req.params.commentId,
//       userId: req.auth._id,
//     });
//     if (!deleteComment) {
//       res.status(403).send({ error: "Not authorized to delete this comment" });
//       return;
//     }
//     return res.status(200).send({ message: `Comment deleted successfully` });
//   } catch (error) {
//     res.status(500);
//     return next(error);
//   }
// });

// module.exports = commentRouter;
