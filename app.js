const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const signUpRouter = require("./routers/singUp");
const loginRouter = require("./routers/login");
const vchatRouter = require("./routers/vchat");
const sequelize = require("./util/database");
const User = require("./models/user");
const Message = require("./models/message");
const Group = require("./models/group");
const userGroup = require("./models/userGroup");
const msgRouter = require("./routers/message");
const port = 3000;
const app = express();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

const users = {};

/*io.on('connection', socket => {
  console.log(socket.id)
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
}) */

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public", "css")));
app.use(express.static(path.join(__dirname, "public", "js")));
app.use(express.static(path.join(__dirname, "public", "views")));
app.use(express.static(path.join(__dirname, "public", "src")));

app.use(signUpRouter);
app.use(loginRouter);
app.use(vchatRouter);
app.use(msgRouter);

User.hasMany(Message);
Message.belongsTo(User);
Group.hasMany(Message);
Message.belongsTo(Group);

User.hasMany(Group);
Group.belongsTo(User);

User.hasMany(userGroup);
userGroup.belongsTo(User);
Group.hasMany(userGroup);
userGroup.belongsTo(Group);

io.on("connection", (socket) => {
  socket.on("chat message", (msg, room) => {
    console.log(socket.id);
    socket.to(room).emit("chat message", msg);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("-----. room joined", room);
  });
});

app.get("*", (req, res) => {
  res.send("Page Not Found ");
});
sequelize
  .sync()
  .then(() => {
    http.listen(port, () => {
      console.log(`Server running on port ${port} `);
    });
  })
  .catch((err) => {
    throw new Error(err);
  });
