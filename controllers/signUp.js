const path = require("path");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { error } = require("console");

exports.getSignUpPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "signUp.html"));
};
exports.getSignUpSuccess = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "../", "public", "views", "successRegister.html")
  );
};

exports.postUserData = (req, res, next) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  };

  try {
    bcrypt.hash(user.password, 12, (error, hash) => {
      User.create({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: hash,
      })
        .then(() => {
          res.redirect("/successful-registered");
          console.log("New User Come..");
        })
        .catch((err) => {
          res.status(200).send("Email Already exist, use different email");
        });
    });
  } catch (error) {
    console.log(error);
  }
};
