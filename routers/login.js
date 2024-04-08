const express = require("express");
const path = require("path");
const { route } = require("./singUp");
const loginController = require("../controllers/login");

const router = express.Router();

router.get("/login", loginController.getLoginPage);
router.post("/validiate-user", loginController.postValidiateUser);

module.exports = router;
