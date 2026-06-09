const express = require("express");
const robotController = require("../controllers/robotControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.post("/create", authMiddleware.restrictTo("superadmin"), robotController.createRobot); 
router.get("/robots", authMiddleware.protect, robotController.getAllRobots);
router.get("/robots/:id", authMiddleware.protect, robotController.getRobot);

router.put("/robots/:id", authMiddleware.protect, robotController.updateRobot);
router.delete("/robots/:id", authMiddleware.protect, robotController.deleteRobot);


module.exports = router;