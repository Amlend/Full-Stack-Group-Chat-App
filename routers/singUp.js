const express = require("express");
const signUpController = require("../controllers/signUp");
const Authorization = require("../middleware/auth");
const router = express.Router();

router.get("/signUp", signUpController.getSignUpPage);
router.post("/register-user", signUpController.postUserData);
router.get("/successful-registered", signUpController.getSignUpSuccess);
router.post(
  "/searchUser",
  Authorization.authentication,
  signUpController.postSearchUser
);

module.exports = router;
