// General Imports
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const cors = require("cors");
const dotenv = require("dotenv");

// DOTENV CONFIG
dotenv.config();

// Application Module Import
const sequelize = require("./utils/database");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

// All Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public", "css")));
app.use(express.static(path.join(__dirname, "public", "js")));
app.use(express.static(path.join(__dirname, "public", "views")));

//  Registering Routers
const routers = [
  require("./routers/userRouter"),
  require("./routers/messageRouter"),
  require("./routers/friendsRouter"),
  require("./routers/groupRouter"),
];

for (const router of routers) {
  app.use(router);
}

const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  connectedUsers[socket.id] = socket; // Add socket to connectedUsers

  socket.on("disconnect", () => {
    console.log("A user disconnected: ", socket.id);
    delete connectedUsers[socket.id]; // Remove socket from connectedUsers
  });

  socket.on("join-room", (roomId) => {
    socket.join(roomId); // Join the specified room
  });

  socket.on("send-message", (message) => {
    const { to, content } = message;

    if (connectedUsers[to]) {
      connectedUsers[to].socket.emit("receive-message", {
        from: socket.id,
        content,
      });
    } else {
      // Handle offline message logic (e.g., store or notify later)
      console.log(`${to} is offline. Message not delivered.`);
    }
  });
});

sequelize
  .sync()
  .then(() => {
    http.listen(port, () => {
      console.log(`Listening on ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
