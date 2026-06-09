const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const commandController = require("../controllers/commandControllers");

const router = express.Router();

router.use(authMiddleware.protect);

router.post("/:uuid/start", authMiddleware.protect, commandController.startRobot);
router.post("/:uuid/stop", authMiddleware.protect, commandController.stopRobot);

module.exports = router;