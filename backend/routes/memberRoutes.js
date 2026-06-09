const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const memberController=require("../controllers/memberControllers");
const upload = require("../middlewares/imageMulter")

const router = express.Router();
router.use(authMiddleware.protect);
router.post("/postImage", authMiddleware.restrictTo("superadmin"), upload.single("image"), memberController.uploadImage);
router.get("/all", authMiddleware.restrictTo("superadmin"), memberController.getImages);
router.get("/image/:id", authMiddleware.restrictTo("superadmin"), memberController.getImage);
router.delete("/remove/:id", authMiddleware.restrictTo("superadmin"), memberController.deleteImage);

module.exports = router;
