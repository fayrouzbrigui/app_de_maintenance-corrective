const express = require("express");
const reportController = require("../controllers/reportControllers");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();
router.use(authMiddleware.protect);

router.get("/report", authMiddleware.restrictTo("superadmin"), reportController.getReport);
router.get("/history", authMiddleware.restrictTo("superadmin"), reportController.getHistory);

module.exports = router;

