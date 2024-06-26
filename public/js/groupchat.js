let chatForm = document.getElementById("chat-form");
let chatBox = document.getElementById("message-box");
const socket = io();
chatForm.addEventListener("submit", sendMessage);

async function sendMessage(event) {
  event.preventDefault();

  let formObj = new FormData(chatForm);

  let message = {};

  for (const [key, value] of formObj) {
    message[key] = value;
  }

  let to = localStorage.getItem("groupChat");
  if (to === undefined) {
    alert("Please Select Friend");
    window.location.href = "/friends";
  }
  message["groupId"] = to;
  let res = await axios({
    method: "post",
    url: api + "group/message",
    data: message,
  });
  document.getElementById("messa").value = "";
  socket.emit("send-message", message); // Send message to server
}

socket.on("receive-message", (data) => {
  const { from, content } = data;

  // display received message
  let structure;
  if (from === socket.id) {
    structure = `
          <div class="col col-12 text-end p-2">
              ${content}
          </div>
        `;
  } else {
    structure = `
          <div class="col col-12 p-2">${content}</div>
        `;
  }

  let ele = document.createElement("div");
  ele.setAttribute("class", from === socket.id ? "row bg-chat" : "row");
  ele.innerHTML = structure;
  chatBox.appendChild(ele);
});

window.addEventListener("DOMContentLoaded", getAllMessages);

let lastIndex = 0;
function getAllMessages(event) {
  // From Local Storage
  let to = localStorage.getItem("groupChat");
  let self = localStorage.getItem("self");

  let store = JSON.parse(localStorage.getItem("group_messages"));

  if (store) {
    for (const sender of store) {
      if (Number(sender.group) === Number(to)) {
        lastIndex = sender["group_messages"].at(-1).id;

        for (const d of sender["group_messages"]) {
          if (Number(d.user.id) === Number(self)) {
            let structure = `     
                        <div class="col col-12 text-end p-2">
                            ${d.message}
                     
                        </div>
                      `;

            let ele = document.createElement("div");
            ele.setAttribute("class", "row bg-chat");
            ele.innerHTML = structure;
            chatBox.appendChild(ele);
          } else {
            let structure = `     
              <div class="col col-12 p-2">${d.user.name}:${d.message}</div>
           `;

            let ele = document.createElement("div");
            ele.setAttribute("class", "row");
            ele.innerHTML = structure;
            chatBox.appendChild(ele);
          }
        }
      }
    }
  }

  setInterval(() => {
    fromBackend();
  }, 1000);
}
async function fromBackend() {
  let to = localStorage.getItem("groupChat");

  // From Backend
  try {
    let res = await axios({
      method: "get",
      url: api + "group/message?id=" + to + "&&skip=" + lastIndex,
    });
    let data = res.data.data.message;
    let self = Number(res.data.data.self);
    localStorage.setItem("self", self);

    let message = data.length > 0 ? data[0].groupMessages : [];
    let groupName = data.name;

    // Storing Local Storage
    if (message.length > 0) {
      let getMessages = localStorage.getItem("group_messages");

      if (getMessages) {
        let arr = JSON.parse(getMessages);

        // This flag is used for check new login user array object
        let flag = true;

        for (const d of arr) {
          if (Number(d.group) === Number(to)) {
            for (const dd of message) {
              d["group_messages"].push(dd);
              if (d["group_messages"].length > 10) {
                d["group_messages"].shift();
              }
              flag = false;
            }
          }
        }

        if (flag === true) {
          /**
           * Work if Obj is not present in array then we need to create new user obj.
           *
           */
          obj = {};
          obj["group_messages"] = [];
          obj["group"] = to; // Group ID Storing

          let length = message.length;

          for (const d of message) {
            if (length < 10) {
              obj["group_messages"].push(d);
            }
            length--;
          }

          arr.push(obj);
        }

        localStorage.setItem("group_messages", JSON.stringify(arr));
      } else {
        let arr = [];

        obj = {};
        obj["group_messages"] = [];
        obj["group"] = to;

        let length = message.length;

        for (const d of message) {
          if (length < 10) {
            obj["group_messages"].push(d);
          }
          length--;
        }

        arr.push(obj);
        localStorage.setItem("group_messages", JSON.stringify(arr));
      }
    }

    for (const d of message) {
      if (d.user.id === Number(self)) {
        let structure = `
                    <div class="col col-12 text-end p-2">
                        ${d.message}
                       
                    </div>
                  `;

        let ele = document.createElement("div");
        ele.setAttribute("class", "row bg-chat");
        ele.innerHTML = structure;
        chatBox.appendChild(ele);
      } else {
        let structure = `
          <div class="col col-12 p-2"> ${d.user.name}: ${d.message}</div>
       `;

        let ele = document.createElement("div");
        ele.setAttribute("class", "row");
        ele.innerHTML = structure;
        chatBox.appendChild(ele);
      }
      lastIndex = d.id;
    }
    const room = `group${groupName}`;
    socket.emit("join-room", room);
  } catch (err) {
    console.log(err);
  }
}

async function sendImage(event) {
  const file = event.files[0];
  console.log(file);
  const formData = new FormData();
  formData.append("image", file);
  await axios
    .post("http://16.170.239.102/send-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((result) => {
      const imgUrl = result.data.imgUrl;
      console.log(imgUrl);
      document.getElementById("messa").value = imgUrl;
    })
    .catch((err) => {
      console.log(err);
    });
}
