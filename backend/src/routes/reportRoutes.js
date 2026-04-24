const express = require('express');
const Report = require('../models/Report');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const reports = await Report.find().populate('ngoId', 'name email').sort('-createdAt');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const report = await Report.create({
      ...req.body,
      ngoId: req.user._id
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
