window.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

async function fetchData() {
  const token = localStorage.getItem("token");
  await axios
    .get("http://localhost:3000/get-msg", { headers: { Authorization: token } })
    .then((response) => {
      console.log(response);
      const messages = response.data.messages;

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
