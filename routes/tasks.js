const express = require("express");
const Task = require("../models/task");
const router = express.Router();

// Add new task
router.post("/", async (req, res) => {
  const { task } = req.body;
  const newTask = new Task({
    description: task,
    user: req.user._id,
  });
  await newTask.save();
  res.redirect("/");
});

// Mark task as completed
router.post("/complete/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    task.status = "completed";
    await task.save();
  }
  res.redirect("/");
});

// Mark task as deleted
router.post("/delete/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    task.status = "deleted";
    await task.save();
  }
  res.redirect("/");
});

// Fetch tasks for logged-in user
router.get("/", async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.render("index", { tasks });
});

module.exports = router;
