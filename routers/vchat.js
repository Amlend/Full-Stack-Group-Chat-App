const express = require("express");
const vchatController = require("../controllers/vchat");

const router = express.Router();

router.get("/vchat", vchatController.getChatPage);
//router.get('/vchatCall', vchatController.getPage);

module.exports = router;
