const express = require("express");
const Issue = require("../models/issue");
const Comment = require("../models/comment");
const issueRouter = express.Router();

issueRouter.get("/", async (req, res, next) => {
  try {
    const issues = await Issue.find();
    return res.status(200).send(issues);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

issueRouter.get("/public", async (req, res, next) => {
  try {
    const issues = await Issue.find();
    return res.status(200).send(issues);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

issueRouter.get("/user", async (req, res, next) => {
  try {
    const userId = req.auth._id;
    const userIssues = await Issue.find({ userId });
    return res.status(200).send(userIssues);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

issueRouter.post("/", async (req, res, next) => {
  try {
    req.body.username = req.auth.username;
    req.body.userId = req.auth._id;
    const newIssue = new Issue(req.body);
    const savedIssue = await newIssue.save();
    return res.status(201).send(savedIssue);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

issueRouter.put("/upvotes/:issueID", async (req, res, next) => {
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.issueID,
      {
        $addToSet: { upvotes: req.auth._id },
        $pull: { downvotes: req.auth._id },
      },
      { new: true }
    );
    return res.status(201).send(updatedIssue);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

issueRouter.put("/downvotes/:issueID", async (req, res, next) => {
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.issueID,
      {
        $addToSet: { downvotes: req.auth._id },
        $pull: { upvotes: req.auth._id },
      },
      { new: true }
    );
    return res.status(201).send(updatedIssue);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

issueRouter.put("/:issueID", async (req, res, next) => {
  try {
    const updatedIssue = await Issue.findOneAndUpdate(
      { _id: req.params.issueID, userId: req.auth._id },
      req.body,
      { new: true }
    );
    if (!updatedIssue) {
      res.status(403);
      return next(new Error("Not authorized to update this issue"));
    }
    return res.status(200).send(updatedIssue);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

issueRouter.delete("/:issueId", async (req, res, next) => {
  try {
    const deletedIssue = await Issue.findOneAndDelete({
      _id: req.params.issueId,
      userId: req.auth._id,
    });
    if (!deletedIssue) {
      res.status(403);
      return next(new Error("Not authorized to delete this issue"));
    }
    return res
      .status(200)
      .send({ message: `Issue ${deletedIssue.title} deleted successfully` });
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

issueRouter.get("/:issueId", async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.issueId);
    const comments = await Comment.find({
      issueId: req.params.issueId,
    }).populate("userId", "username");
    res.status(200).send({ issue, comments });
  } catch (error) {
    res.status(500);
    next(error);
  }
});

module.exports = issueRouter;
