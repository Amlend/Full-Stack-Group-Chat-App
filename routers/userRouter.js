const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/user/signup", userController.getSignUpPage);
router.post("/user/signup", userController.signup);
router.get("/user/login", userController.getLoginPage);
router.post("/user/login", userController.login);
module.exports = router;
