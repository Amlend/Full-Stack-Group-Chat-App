const path = require("path");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getLoginPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
};

exports.postValidiateUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  function generateWebToken(id) {
    return jwt.sign({ userId: id }, "123456abcdef");
  }

  try {
    await User.findOne({ where: { email: email } })
      .then((user) => {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result === true) {
            res.status(200).json({
              success: true,
              Message: "Login Successfull",
              token: generateWebToken(user.id),
            });
          } else {
            res
              .status(500)
              .json({ success: false, Message: "You entered wrong password." });
          }
        });
      })
      .catch((err) => {
        res.send({ message: "User Not Found 404" });
        throw new Error(err);
      });
  } catch (error) {
    console.log(error);
  }
};
