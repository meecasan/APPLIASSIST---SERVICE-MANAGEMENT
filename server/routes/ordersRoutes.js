const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const authMiddleware = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const orderSchemas = require('../validation/orderSchemas');

// Create order - customers and admins
router.post('/', authMiddleware, role(['customer','admin']), validate(orderSchemas.createOrder), ordersController.createOrder);

// List orders - admin and store owners (with filtering options)
router.get('/', authMiddleware, role(['admin','store_owner']), ordersController.listOrders);

// Get orders for a specific store (for store owners)
router.get('/store/:store_id', authMiddleware, role(['admin','store_owner']), ordersController.getStoreOrders);

// Get order by ID - requires authentication
router.get('/:id', authMiddleware, ordersController.getOrder);

// Update order status - admin and store owners
router.put('/:id/status', authMiddleware, role(['admin','store_owner']), validate(orderSchemas.updateStatus), ordersController.updateStatus);

// Delete order - admin only
router.delete('/:id', authMiddleware, role(['admin']), ordersController.deleteOrder);

module.exports = router;
