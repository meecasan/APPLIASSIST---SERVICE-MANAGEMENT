const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Admin-only user management
router.get('/:type', authMiddleware, role(['admin']), usersController.list);
router.get('/:type/:id', authMiddleware, role(['admin']), usersController.get);
router.put('/:type/:id', authMiddleware, role(['admin']), usersController.update);
router.delete('/:type/:id', authMiddleware, role(['admin']), usersController.delete);

module.exports = router;
