const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/auth');

// @route GET /api/tasks
// @desc Get tasks for the logged in user or all for admin
router.get('/', protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      tasks = await Task.find().populate('assignee project', 'name title');
    } else {
      tasks = await Task.find({ assignee: req.user._id }).populate('assignee project', 'name title');
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route POST /api/tasks
// @desc Create a task (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, assignee, project, dueDate } = req.body;
    
    // Check if project exists
    const projExists = await Project.findById(project);
    if (!projExists) return res.status(404).json({ message: 'Project not found' });

    const task = new Task({
      title,
      description,
      assignee: assignee || null,
      project,
      dueDate
    });

    const createdTask = await task.save();
    const populatedTask = await Task.findById(createdTask._id).populate('assignee project', 'name title');
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route PUT /api/tasks/:id/status
// @desc Update task status (Any user can update their assigned task)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Allow Admin or Assignee to update status
    if (req.user.role !== 'Admin' && task.assignee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
