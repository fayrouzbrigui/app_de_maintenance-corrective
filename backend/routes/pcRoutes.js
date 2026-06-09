const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const pcController = require("../controllers/pcControllers");

const router = express.Router();

router.use(authMiddleware.protect);
router.get("/pc/:uuid", authMiddleware.protect, pcController.getPcByRobot);

module.exports = router;
