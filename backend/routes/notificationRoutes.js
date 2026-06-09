const express = require("express");
const notificationController = require('../controllers/notificationControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get("/notifications", authMiddleware.protect, notificationController.getNotifications);
router.put("/:id/read", authMiddleware.protect, notificationController.markAsRead);
router.delete("/:id/delete", authMiddleware.protect, notificationController.deleteNotification);

module.exports = router;