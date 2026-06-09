const express = require("express");
const infoController = require("../controllers/infoControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(authMiddleware.protect);
router.get("/info/:uuid", authMiddleware.protect, infoController.getInfoByRobot);

module.exports = router;

