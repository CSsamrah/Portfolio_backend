const express = require('express');
const router = express.Router();
const Technology = require('../models/Technology');

// GET all technologies
router.get('/', async (req, res) => {
  try {
    const technologies = await Technology.find().sort({ order: 1, name: 1 });
    res.json(technologies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new technology
router.post('/', async (req, res) => {
  try {
    const technology = new Technology(req.body);
    await technology.save();
    res.status(201).json(technology);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update technology
router.put('/:id', async (req, res) => {
  try {
    const technology = await Technology.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!technology) {
      return res.status(404).json({ error: 'Technology not found' });
    }
    res.json(technology);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE technology
router.delete('/:id', async (req, res) => {
  try {
    const technology = await Technology.findByIdAndDelete(req.params.id);
    if (!technology) {
      return res.status(404).json({ error: 'Technology not found' });
    }
    res.json({ message: 'Technology deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;