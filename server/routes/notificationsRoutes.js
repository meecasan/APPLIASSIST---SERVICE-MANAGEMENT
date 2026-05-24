const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const notificationSchemas = require('../validation/notificationSchemas');

router.post('/', authMiddleware, validate(notificationSchemas.createNotification), notificationsController.createNotification);
router.get('/', authMiddleware, notificationsController.listNotifications);
router.put('/:id/read', authMiddleware, notificationsController.markRead);

module.exports = router;
