const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const cameraController = require("../controllers/cameraControllers");

const router = express.Router();

router.use(authMiddleware.protect);
router.get("/camera/:uuid", authMiddleware.protect, cameraController.getCameraByRobot);

module.exports = router;
