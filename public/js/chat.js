let chatForm = document.getElementById("chat-form");
let chatBox = document.getElementById("message-box");
let friendName = document.getElementById("friend-name");
const socket = io();
chatForm.addEventListener("submit", sendMessage);

async function sendMessage(event) {
  event.preventDefault();

  let formObj = new FormData(chatForm);

  let message = {};

  for (const [key, value] of formObj) {
    message[key] = value;
  }

  let to = localStorage.getItem("chat");
  if (to === undefined) {
    alert("Please Select Friend");
    window.location.href = "/friends";
  }
  message["to"] = to;
  let res = await axios({
    method: "post",
    url: api + "message",
    data: message,
  });
  document.getElementById("mess").value = "";
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
  let to = localStorage.getItem("chat");

  let store = JSON.parse(localStorage.getItem("message"));

  if (store) {
    for (const sender of store) {
      if (Number(sender.to) === Number(to)) {
        lastIndex = sender["messages"].at(-1).id;
        console.log(lastIndex);
        for (const d of sender["messages"]) {
          if (Number(d.toUser) === Number(to)) {
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
              <div class="col col-12 p-2">${d.message}</div>
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
  let to = localStorage.getItem("chat");

  // From Backend
  try {
    let res = await axios({
      method: "post",
      url: api + "message/all",
      data: { to: to, skip: lastIndex },
    });
    let data = res.data.data.message;
    let user = res.data.data.user;

    // Storing Local Storage
    if (data.length > 0) {
      let getMessages = localStorage.getItem("message");

      if (getMessages) {
        let arr = JSON.parse(getMessages);

        // This flag is used for check new login user array object
        let flag = true;

        for (const d of arr) {
          if (Number(d.to) === Number(to)) {
            for (const dd of data) {
              d["messages"].push(dd);
              if (d["messages"].length > 10) {
                d["messages"].shift();
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
          obj["messages"] = [];
          obj["to"] = to;

          let length = data.length;

          for (const d of data) {
            if (length < 10) {
              obj["messages"].push(d);
            }
            length--;
          }

          arr.push(obj);
        }

        localStorage.setItem("message", JSON.stringify(arr));
      } else {
        let arr = [];

        obj = {};
        obj["messages"] = [];
        obj["to"] = to;

        let length = data.length;

        for (const d of data) {
          if (length < 10) {
            obj["messages"].push(d);
          }
          length--;
        }

        arr.push(obj);
        localStorage.setItem("message", JSON.stringify(arr));
      }
    }

    for (const d of data) {
      if (d.toUser === Number(to)) {
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
          <div class="col col-12 p-2">${d.message}</div>
       `;

        let ele = document.createElement("div");
        ele.setAttribute("class", "row");
        ele.innerHTML = structure;
        chatBox.appendChild(ele);
      }
      lastIndex = d.id;
    }
    const room = `chat${user}`;
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
      document.getElementById("mess").value = imgUrl;
    })
    .catch((err) => {
      console.log(err);
    });
}
