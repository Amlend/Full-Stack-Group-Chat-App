const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authentication = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    const user = jwt.verify(token, "123456abcdef");

    console.log(">>>> User Verified :", user.userId);
    User.findByPk(user.userId).then((user) => {
      req.user = user;

      next();
    });
  } catch (error) {
    console.log(error, "Middleware error");
  }
};
