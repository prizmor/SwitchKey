const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
const mongoose = require('mongoose');
const router = require('./router');
const cors = require('cors');
const PORT = 5000;
const jwt = require('jsonwebtoken');
const User = require('./modules/user');
const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});


const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://prizmor:prizmor@cluster0.fvqqb.mongodb.net/SwitchKey?retryWrites=true&w=majority`)
    server.listen(PORT, () => console.log('Server started, port: ' + PORT));
  } catch (e) {
    console.error('error');
  }
};

start();

let connectedUsers = [];

io.on("connection", (socket) => {
  if (!socket.handshake.auth.token) {
    socket.disconnect();
  } else {
    const parsedToken = JSON.parse(socket.handshake.auth.token);
    const decodedData = jwt.verify(parsedToken, 'SECRET_KEY_RANDOM');
    User.findOne({_id: decodedData.userId}).then(data => {
      if (!data) {
        socket.disconnect();
      } else {
        let user = connectedUsers.find(x => x.key === decodedData.userId);
        if (user) {
          socket.disconnect();
        } else {
          connectedUsers.push({
            key: decodedData.userId,
            login: data.login,
            socketId: socket.id,
            socket: socket
          })
          console.log('connect ' + data.login);
        }
      }
    });
  }
  socket.on('logout', (data) => {
    socket.disconnect();
  });

  socket.on('friendRequest', ({login, from}) => {
    let user = connectedUsers.find(x => x.login === login);
    if (user) {
      User.findOne({login: login}).then(data => {
        data.friendRequests.push({
          id: uuidv4(),
          login: from
        });
        data.message.unshift({
          message: `${from} пригласил вас в друзья`,
          type: 'friendRequest'
        })
        user.socket.emit('friendRequestMessage', {
          id: uuidv4(),
          login: from
        });
        data.save();
        console.log('lol')
      });
    } else {
      User.findOne({login: login}).then(data => {
        data.friendRequests.push({
          id: uuidv4(),
          login: from
        });
        data.save();
      });
    }
  });

  socket.on('deleteMessage', (data) => {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    User.findOne({login : connectUser.login}).then(res => {
      res.message = [];
      res.save();
      socket.emit('deleteMessageComplete');
    });
  });

  socket.on('disconnect', (data) => {
    let user = connectedUsers.findIndex(x => x.socketId === socket.id);
    connectedUsers.splice(user, 1);
    console.log('disconnect');
  });






});



