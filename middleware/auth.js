const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authentication = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    const user = jwt.verify(token, "123456abcdef");

    console.log(">>>> User Verified :", user.userId);
    User.findByPk(user.userId)
      .then((user) => {
        req.user = user;

        next();
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log("Middleware error");
  }
};
