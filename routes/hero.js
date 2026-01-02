const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');

// GET hero data
router.get('/', async (req, res) => {
  try {
    const hero = await Hero.findOne();
    if (!hero) {
      return res.status(404).json({ error: 'Hero data not found' });
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST/PUT hero data (create or update)
router.post('/', async (req, res) => {
  try {
    const existingHero = await Hero.findOne();
    
    if (existingHero) {
      const updatedHero = await Hero.findByIdAndUpdate(
        existingHero._id,
        req.body,
        { new: true, runValidators: true }
      );
      return res.json(updatedHero);
    }
    
    const hero = new Hero(req.body);
    await hero.save();
    res.status(201).json(hero);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
