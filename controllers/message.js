const express = require("express");
const Message = require("../models/message");
const User = require("../models/message");
exports.PostMessage = (req, res, next) => {
  const msg = req.body.message;
  const userId = req.user.id;
  const groupid = req.body.groupId;

  Message.create({
    message: msg,
    userId: userId,
    groupId: groupid,
  })
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getMsg = (req, res, next) => {
  const groupId = req.header("GroupId");
  const user = req.user.id;

  try {
    User.findOne({ where: { id: user } })
      .then(() => {
        Message.findAll({ where: { groupId: groupId } })
          .then((msg) => {
            //  console.log(msg)
            res
              .status(200)
              .json({ success: true, messages: msg, userId: user });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};
