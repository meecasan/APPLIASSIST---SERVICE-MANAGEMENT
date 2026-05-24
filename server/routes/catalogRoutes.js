const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

// Public route to fetch all active services
router.get('/', catalogController.getAllServices);

// Public route to fetch services filtered by category
router.get('/category/:category', catalogController.getServicesByCategory);

module.exports = router;
