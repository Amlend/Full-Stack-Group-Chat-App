const express = require("express");
const Message = require("../models/message");
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
