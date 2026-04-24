const express = require('express');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { protect, adminOrNgo } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/tasks
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email').populate('createdBy', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks
router.post('/', protect, adminOrNgo, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id
    });

    // Notify clients
    req.io.emit('new_task', task);
    
    // Save broadcast notification
    await Notification.create({ message: `New task created: ${task.title}` });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id/assign
router.put('/:id/assign', protect, adminOrNgo, async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.assignedTo) return res.status(400).json({ message: 'Task already assigned' });

    task.assignedTo = volunteerId;
    task.status = 'In Progress';
    await task.save();

    req.io.emit('task_updated', task);
    
    // Notify specific user
    const msg = `You have been assigned a task: ${task.title}`;
    await Notification.create({ message: msg, userId: volunteerId });
    req.io.emit(`notification_${volunteerId}`, msg);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id/status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = status;
    await task.save();
    
    req.io.emit('task_updated', task);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
