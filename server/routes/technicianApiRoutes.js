const express = require('express');
const router = express.Router();
const technicianApiController = require('../controllers/technicianApiController');
const authMiddleware = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// All these routes require a technician role
router.use(authMiddleware, role(['technician']));

// Profile
router.get('/profile', technicianApiController.getProfile);
router.put('/profile', technicianApiController.updateProfile);

// Service Requests
router.get('/requests', technicianApiController.getMyRequests);

// Services Catalog
router.get('/services', technicianApiController.getMyServices);
router.post('/services', technicianApiController.createService);
router.put('/services/:id', technicianApiController.updateService);
router.delete('/services/:id', technicianApiController.deleteService);

module.exports = router;
