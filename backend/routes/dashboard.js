const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route GET /api/dashboard/stats
// @desc Get dashboard stats based on role
router.get('/stats', protect, async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'Admin') {
      const totalProjects = await Project.countDocuments();
      const totalTasks = await Task.countDocuments();
      const totalUsers = await User.countDocuments();
      
      const tasksByStatus = await Task.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      
      const overdueTasks = await Task.countDocuments({
        dueDate: { $lt: new Date() },
        status: { $ne: 'Done' }
      });

      stats = { totalProjects, totalTasks, totalUsers, tasksByStatus, overdueTasks };
    } else {
      const totalTasks = await Task.countDocuments({ assignee: req.user._id });
      const tasksByStatus = await Task.aggregate([
        { $match: { assignee: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      const overdueTasks = await Task.countDocuments({
        assignee: req.user._id,
        dueDate: { $lt: new Date() },
        status: { $ne: 'Done' }
      });

      stats = { totalTasks, tasksByStatus, overdueTasks };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
