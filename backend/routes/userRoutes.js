const express = require("express");
const userController = require("../controllers/usersControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.use(authMiddleware.protect);

router.get("/users", authMiddleware.restrictTo("superadmin"), userController.getAllUsers);
router.get("/users/:id", userController.getUser);

router.post("/users", authMiddleware.restrictTo("superadmin"), userController.createUser); 
router.put("/users/:id", authMiddleware.restrictTo("superadmin"), userController.updateUser);
router.delete("/users/:id", authMiddleware.restrictTo("superadmin"), userController.deleteUser);

router.get("/profile", authMiddleware.protect, userController.getProfile);

module.exports = router;