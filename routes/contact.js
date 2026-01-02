const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// GET contact data
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({ error: 'Contact data not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST/PUT contact data (create or update)
router.post('/', async (req, res) => {
  try {
    const existingContact = await Contact.findOne();
    
    if (existingContact) {
      const updatedContact = await Contact.findByIdAndUpdate(
        existingContact._id,
        req.body,
        { new: true, runValidators: true }
      );
      return res.json(updatedContact);
    }
    
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;