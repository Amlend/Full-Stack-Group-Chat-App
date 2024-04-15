const { Sequelize } = require("sequelize");

// Adding Details of Sequelize

const DB_NAME = process.env.DB_NAME;
const DB_UN = process.env.USER_NAME;
const DB_P = process.env.DB_PASSWORD;
const DB_H = process.env.DB_HOST;

const sequelize = new Sequelize(DB_NAME, DB_UN, DB_P, {
  dialect: "mysql",
  host: DB_H,
});

// Add All Database here
const models = [
  require("../models/user"),
  require("../models/message"),
  require("../models/group"),
  require("../models/groupMessage"),
  require("../models/groupUser"),
];

for (const model of models) {
  model(sequelize);
}

// All Models
const User = sequelize.models.user;
const Message = sequelize.models.message;
const Group = sequelize.models.group;
const groupMessage = sequelize.models.groupMessage;
const groupUser = sequelize.models.groupUser;

// Relationships
User.hasMany(Message, {
  onDelete: "CASCADE",
});
Message.belongsTo(User);

// Group Relationship
Group.belongsToMany(User, {
  onDelete: "CASCADE",
  through: "groupUser",
});

// Group Message Relation
// Include work in this type of relationship (belongsTo)
Group.hasMany(groupMessage, {
  onDelete: "CASCADE",
});
groupMessage.belongsTo(Group);
User.hasMany(groupMessage, {
  onDelete: "CASCADE",
});
groupMessage.belongsTo(User);

module.exports = sequelize;
