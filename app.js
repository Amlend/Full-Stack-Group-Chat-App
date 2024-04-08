const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const signUpRouter = require("./routers/singUp");
const loginRouter = require("./routers/login");
const sequelize = require("./util/database");
const User = require("./models/user");
const port = 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public", "css")));
app.use(express.static(path.join(__dirname, "public", "js")));
app.use(express.static(path.join(__dirname, "public", "views")));

app.use(signUpRouter);
app.use(loginRouter);

app.get("*", (req, res) => {
  res.send("Page Not Found ");
});
sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port} `);
    });
  })
  .catch((err) => {
    throw new Error(err);
  });
