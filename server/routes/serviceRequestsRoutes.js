/**
 * FIX #1: Add Service Requests API Endpoint
 * Location: server/routes/serviceRequestsRoutes.js (NEW FILE)
 * 
 * This handles service booking submissions (from BookingFlow component)
 */

const express = require('express');
const router = express.Router();
const serviceRequestsController = require('../controllers/serviceRequestsController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// Create service request (customer booking a technician)
router.post(
  '/',
  authMiddleware,
  serviceRequestsController.createServiceRequest
);

// List service requests (with query filters)
router.get(
  '/',
  authMiddleware,
  serviceRequestsController.listServiceRequests
);

// Get service requests for a customer
router.get(
  '/customer/:customer_id',
  authMiddleware,
  serviceRequestsController.getCustomerServiceRequests
);

// Get service requests assigned to a technician
router.get(
  '/technician/:technician_id',
  authMiddleware,
  serviceRequestsController.getTechnicianServiceRequests
);

// Get single service request
router.get(
  '/:id',
  authMiddleware,
  serviceRequestsController.getServiceRequest
);

// Update service request status (e.g., assign technician, complete, cancel)
router.put(
  '/:id/status',
  authMiddleware,
  serviceRequestsController.updateServiceRequestStatus
);

module.exports = router;
