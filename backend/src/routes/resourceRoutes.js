const express = require('express');
const Resource = require('../models/Resource');
const { protect, adminOrNgo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const resources = await Resource.find().populate('addedBy', 'name');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, adminOrNgo, async (req, res) => {
  try {
    const resource = await Resource.create({
      ...req.body,
      addedBy: req.user._id
    });
    
    req.io.emit('resource_updated', resource);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
