const express = require("express");
const vchatController = require("../controllers/vchat");
const authenticat = require("../middleware/auth");

const router = express.Router();

router.get("/vchat", vchatController.getChatPage);
router.post(
  "/groupcreate",
  authenticat.authentication,
  vchatController.postGroupCreate
);
router.get(
  "/get-groups",
  authenticat.authentication,
  vchatController.getGroups
);
//router.get('/vchatCall', vchatController.getPage);

module.exports = router;
