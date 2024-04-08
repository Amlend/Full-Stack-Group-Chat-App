const express = require("express");
const signUpController = require("../controllers/signUp");

const router = express.Router();

router.get("/signUp", signUpController.getSignUpPage);
router.post("/register-user", signUpController.postUserData);
router.get("/successful-registered", signUpController.getSignUpSuccess);

module.exports = router;
