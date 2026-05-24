const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get pending users for approval
router.get('/pending/technicians', adminController.getPendingTechnicians);

// Get rejected users
router.get('/rejected/technicians', adminController.getRejectedTechnicians);

// Approve applications
router.put('/approve/technician/:technician_id', adminController.approveTechnician);

// Reject applications
router.put('/reject/technician/:technician_id', adminController.rejectTechnician);

module.exports = router;
