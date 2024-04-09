window.addEventListener("DOMContentLoaded", () => {
  fetchData();
  GroupinPanel();
});

setInterval(async () => {
  const token = localStorage.getItem("token");
  const groupid = localStorage.getItem("current_groupId");
  await axios
    .get("http://localhost:3000/get-msg", {
      headers: { Authorization: token, GroupId: groupid },
    })
    .then((response) => {
      console.log(response);
      const message = response.data.messages;
      const oldData = localStorage.getItem("currentData");
      localStorage.setItem("currentData", message.length);

      if (message.length > oldData) {
        if (response.data.success === true) {
          for (let i = oldData; i < message.length; i++) {
            addToMsgBox(message[i], response.data.userId);
          }
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}, 1000);

async function fetchData() {
  const token = localStorage.getItem("token");
  const groupid = localStorage.getItem("current_groupId");
  await axios
    .get("http://localhost:3000/get-msg", {
      headers: { Authorization: token, GroupId: groupid },
    })
    .then((response) => {
      const messages = response.data.messages;
      localStorage.setItem("currentData", messages.length);

      if (response.data.success === true) {
        for (let i = 0; i < messages.length; i++) {
          addToMsgBox(messages[i], response.data.userId);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function addToMsgBox(msg, userId) {
  const bodyDiv = document.getElementById("msgBox");

  const right = document.createElement("div");
  const left = document.createElement("div");

  right.classList = "container message right";
  left.classList = "container message left";

  if (msg.userId === userId) {
    right.appendChild(document.createTextNode(msg.message));

    bodyDiv.appendChild(right);
  }
  if (msg.userId != userId) {
    left.appendChild(document.createTextNode(msg.message));
    bodyDiv.appendChild(left);
  }
}

async function CreateGroup() {
  const groupName = document.getElementById("GroupName").value;
  const token = localStorage.getItem("token");
  await axios
    .post(
      "http://localhost:3000/groupcreate",
      { groupName },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      if (response.data.success === true) {
        alert(`${groupName} Group Created`);
        document.getElementById("GroupName").value = "";
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function GroupinPanel() {
  function GroupList(group) {
    const groupPanel = document.getElementById("groupPanel");

    const li = document.createElement("li");

    const groupName = document.createTextNode(group.name);
    li.appendChild(groupName);

    groupPanel.appendChild(li);
    li.addEventListener("click", function groupMessage() {
      localStorage.setItem("current_groupId", group.id);
      const GName = document.getElementById("headGroupName");

      const hname = document.createTextNode(group.name);
      GName.firstChild.remove();
      GName.appendChild(hname);
      const Box = document.getElementById("Box");
      Box.firstChild.remove();

      const msgBoxDiv = document.createElement("div");
      msgBoxDiv.id = "msgBox";
      Box.appendChild(msgBoxDiv);
      fetchData();
    });
  }

  const token = localStorage.getItem("token");

  await axios
    .get("http://localhost:3000/get-groups", {
      headers: { Authorization: token },
    })
    .then((response) => {
      var groupsName = response.data.groups;
      //  console.log(groupsName)
      const n = groupsName.length;

      for (let k = 0; k < n; k++) {
        GroupList(groupsName[k]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function AddUserInGroup() {
  const searchUserDiv = (document.getElementById("addUserPanel").style.display =
    "block");
}
function hideAddUserPanel() {
  const searchUserDiv = (document.getElementById("addUserPanel").style.display =
    "none");
}

async function SearchUsers() {
  const inputEmail = document.getElementById("search").value;
  const token = localStorage.getItem("token");

  await axios
    .post(
      "http://localhost:3000/searchUser",
      { inputEmail },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      const ul = document.getElementById("groupMenbers");
      const li = document.createElement("li");
      const addbtn = document.createElement("button");
      const btnText = document.createTextNode("+");
      const space = document.createTextNode("  ");
      addbtn.appendChild(btnText);
      const text = document.createTextNode(response.data.user.name);
      li.appendChild(text);
      li.appendChild(space);
      li.appendChild(addbtn);
      ul.appendChild(li);

      addbtn.addEventListener("click", addToGroup);

      async function addToGroup() {
        const userId = response.data.user.id;
        const GroupId = localStorage.getItem("current_groupId");
        const token = localStorage.getItem("token");

        await axios
          .post(
            "http://localhost:3000/add_to_group",
            { userId, GroupId },
            { headers: { Authorization: token } }
          )
          .then((result) => {
            if (result.data.success === true) {
              alert(`${response.data.user.name} added in group`);
              ul.removeChild(li);
            }
          })
          .catch((err) => {
            console.log(result);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function seeUserInGroup() {
  function participentsOfGroup(member) {
    const ul = document.getElementById("membersofgroup");
    const li = document.createElement("li");
    const text = document.createTextNode(member.name);
    li.appendChild(text);
    ul.appendChild(li);
  }

  const searchUserDiv = (document.getElementById("addUserPanel").style.display =
    "block");

  const groupId = localStorage.getItem("current_groupId");
  const token = localStorage.getItem("token");

  await axios
    .post(
      "http://localhost:3000/see_group_users",
      { groupId },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      console.log(response);
      const participents = response.data.users;

      for (let i = 0; i < participents.length; i++) {
        participentsOfGroup(participents[i]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
