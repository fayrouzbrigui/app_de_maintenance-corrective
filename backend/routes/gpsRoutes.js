const express = require("express");
const authMidlleware = require("../middlewares/authMiddleware");
const gpsController = require("../controllers/gpsControllers");

const router = express.Router();

router.use(authMidlleware.protect);
router.get("/gps/:uuid", authMidlleware.protect, gpsController.getGpsByRobot);

module.exports = router;