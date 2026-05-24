const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// REGISTER

// LOGIN
router.post('/login', authController.login);

// Add missing authentication routes
router.post('/register-customer', authController.registerCustomer);
router.post('/register-technician', authController.registerTechnician);

module.exports = router;