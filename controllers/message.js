const express = require("express");
const Message = require("../models/message");
const User = require("../models/message");
exports.PostMessage = (req, res, next) => {
  const msg = req.body.message;
  const userId = req.user.id;

  Message.create({
    message: msg,
    userId: userId,
  })
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getMsg = (req, res, next) => {
  const user = req.user.id;

  try {
    User.findOne({ where: { id: user } })
      .then(() => {
        Message.findAll()
          .then((msg) => {
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
