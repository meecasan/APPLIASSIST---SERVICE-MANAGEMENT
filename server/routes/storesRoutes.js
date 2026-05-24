const express = require('express');
const router = express.Router();
const storesController = require('../controllers/storesController');
const authMiddleware = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const storeSchemas = require('../validation/storeSchemas');

// Public endpoint - list all stores (with optional filtering)
router.get('/', storesController.listStores);

// Check if store owner has a store profile (requires authentication)
router.get('/profile/check', authMiddleware, storesController.checkStoreProfile);

// Get store by ID
router.get('/:id', storesController.getStore);

// Protected routes - require authentication
// Get stores owned by the current user (for store owners)
router.get('/my-stores', authMiddleware, storesController.getMyStores);

// Create store - only store owners and admins
router.post('/', authMiddleware, role(['store_owner','admin']), validate(storeSchemas.createStore), storesController.createStore);

// Update store - only store owners and admins (with ownership validation in controller)
router.put('/:id', authMiddleware, role(['store_owner','admin']), validate(storeSchemas.updateStore), storesController.updateStore);

// Delete store - only store owners and admins (with ownership validation in controller)
router.delete('/:id', authMiddleware, role(['store_owner','admin']), storesController.deleteStore);

module.exports = router;
