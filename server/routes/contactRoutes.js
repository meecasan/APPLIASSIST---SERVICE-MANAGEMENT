/**
 * FIX #3: Contact Messages API Endpoint
 * Location: server/routes/contactRoutes.js (NEW FILE)
 * 
 * Handles contact form submissions
 */

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Submit contact form (no authentication required for public contact)
router.post('/', contactController.submitContact);

// Admin only: Get all contact messages
router.get(
  '/',
  // Optional: Add authMiddleware if you want to protect this
  contactController.getContactMessages
);

module.exports = router;
