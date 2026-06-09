const plateContoller = require("../controllers/plateControllers");
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.use(authMiddleware.protect);

router.post("/add_plate", authMiddleware.restrictTo("superadmin"), plateContoller.createPlate);
router.get("/plates", authMiddleware.restrictTo("superadmin"), plateContoller.getAllPlates);
router.get("/plates/:id", authMiddleware.restrictTo("superadmin"), plateContoller.getPlate);
router.put("/update/:id", authMiddleware.restrictTo("superadmin"), plateContoller.updatePlate);
router.delete("delete/:id", authMiddleware.restrictTo("superadmin"), plateContoller.deletePlate);

module.exports = router;
