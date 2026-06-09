const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const lidarController = require("../controllers/lidarControllers");

const router = express.Router();

router.use(authMiddleware.protect);
router.get("/lidar/:uuid", authMiddleware.protect, lidarController.getLidarByRobot);

module.exports = router;
