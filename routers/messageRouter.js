const express = require("express");
const messageController = require("../controllers/messageController");
const multer = require("multer");
const router = express.Router();

// Post message
router.post("/message", messageController.storeMessage);

// Getting all message from server
router.post("/message/all", messageController.getAllMessages);

//Getting image URL
let upload = multer({
  limits: 1024 * 1024 * 1024 * 5,
  fileFilter: function (req, file, done) {
    if (file.mimetype === "image/jpeg" || "image/png" || "image/jpg") {
      done(null, true);
    } else {
      done("multer error - file type is not supported", false);
    }
  },
});
router.post("/send-image", upload.single("image"), messageController.sendImage);
module.exports = router;
