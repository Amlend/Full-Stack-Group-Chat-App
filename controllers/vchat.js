const path = require("path");
const Group = require("../models/group");
const UsersInGroups = require("../models/userGroup");
exports.getChatPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "msgBox.html"));
};

exports.postGroupCreate = (req, res, next) => {
  const GroupName = req.body.groupName;
  const userid = req.user.id;

  Group.create({
    name: GroupName,
    userId: userid,
  })
    .then((response) => {
      //  console.log(response.id);
      try {
        UsersInGroups.create({
          userId: userid,
          groupId: response.id,
        });

        res.status(200).json({ success: true });
      } catch (error) {
        console.log(error);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getGroups = (req, res, next) => {
  const userid = req.user.id;
  UsersInGroups.findAll({ where: { userId: userid } })
    .then((groups) => {
      // console.log(groups.length)
      let groupIds = [];
      for (let i = 0; i < groups.length; i++) {
        groupIds[i] = groups[i].groupId;
      }
      console.log(groupIds);

      Group.findAll({ where: { id: groupIds }, attributes: ["name"] })
        .then((groupsName) => {
          //console.log(groupsName[0])
          res.status(200).json({ success: true, groups: groupsName });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
