window.addEventListener("DOMContentLoaded", () => {
  fetchData();
  GroupinPanel();
});

/* setInterval( async() => {

  const token = localStorage.getItem('token');
  await axios.get('http://localhost:3000/get-msg',{headers:{"Authorization": token}})
  .then((response) =>{
   console.log(response);
       const message = response.data.messages;
       const oldData = localStorage.getItem('currentData');
       localStorage.setItem('currentData', message.length);

       if(message.length > oldData){
       
        if( response.data.success === true){
          for(let i= oldData; i< message.length; i++){
              addToMsgBox(message[i], response.data.userId);
              
           }
         }

       }

       
  })
  .catch((err) =>{
     console.log(err)
  })
  
}, 1000);*/

async function fetchData() {
  const token = localStorage.getItem("token");
  await axios
    .get("http://localhost:3000/get-msg", { headers: { Authorization: token } })
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
  }

  const token = localStorage.getItem("token");

  await axios
    .get("http://localhost:3000/get-groups", {
      headers: { Authorization: token },
    })
    .then((response) => {
      var groupsName = response.data.groups;
      const n = groupsName.length;

      for (let k = 0; k < n; k++) {
        GroupList(groupsName[k]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
