const express = require("express");
const friendsController = require("../controllers/friendsController");
const router = express.Router();

router.get("/friend", friendsController.allFriends);
router.use("/friends", friendsController.getFriendsPage);

module.exports = router;
