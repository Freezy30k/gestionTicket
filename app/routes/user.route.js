//importer
const router = require("express").Router();
const authController = require("../controllers/auth.Controller");
const userController = require("../controllers/user.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logOut", authController.logOut);

// user db
router.get("/getAllUsers", userController.getAllUsers);
router.get("/userInfo:id", userController.userInfo);
router.put("/updateUser:id", userController.updateUser);

module.exports = router;
