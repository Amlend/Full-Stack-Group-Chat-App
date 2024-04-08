const express = require("express");
const authentication = require("../middleware/auth");
const msgController = require("../controllers/message");

const router = express.Router();

router.post(
  "/msg-send",
  authentication.authentication,
  msgController.PostMessage
);
router.get("/get-msg", authentication.authentication, msgController.getMsg);

module.exports = router;
