const Sequelize = require("sequelize");

const sequelize = new Sequelize("v-chat", "root", "riverdale", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
