const path = require("path");
const User = require("../models/user");

exports.getLoginPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
};

exports.postValidiateUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user.password === password) {
        res.status(200).json({ success: true, Message: "Login Successfull" });
      } else {
        res
          .status(200)
          .json({ success: false, Message: "You entered wrong password." });
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
};
