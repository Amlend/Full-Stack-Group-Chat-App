const path = require("path");

exports.getChatPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "msgBox.html"));
};
exports.getPage = (req, res, next) => {
  //res.redirect('/vchat');
};
