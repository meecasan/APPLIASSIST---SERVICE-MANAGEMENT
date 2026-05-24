const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authMiddleware = require('../middleware/authMiddleware');

// Check if store owner has a store profile
router.get('/profile/check', authMiddleware, storeController.checkStoreProfile);

// Create a new store
router.post('/', authMiddleware, storeController.createStore);

// Get all stores
router.get('/', storeController.getAllStores);

// Get a single store by ID
router.get('/:id', storeController.getStoreById);

// Update a store
router.put('/:id', authMiddleware, storeController.updateStore);

// Delete a store
router.delete('/:id', authMiddleware, storeController.deleteStore);

module.exports = router;