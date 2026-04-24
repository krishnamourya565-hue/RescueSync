const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all volunteers
router.get('/', protect, async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'Volunteer' }).select('-password');
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
