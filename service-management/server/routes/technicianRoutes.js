const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');
const authMiddleware = require('../middleware/authMiddleware');

// Assign a technician to a service request
router.post('/assign', authMiddleware, technicianController.assignTechnician);

// Get all service requests assigned to a technician
router.get('/requests', authMiddleware, technicianController.getTechnicianRequests);

// Update service request status
router.put('/requests/:id/status', authMiddleware, technicianController.updateRequestStatus);

module.exports = router;