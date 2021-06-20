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
    console.log(parsedToken + 'sasdsd')
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
    User.findOne({login: login}).then(loginUser => {
      if (!loginUser || login === from) {
        socket.emit('message', {message: 'Не найден'});
      } else {
        let user = connectedUsers.find(x => x.login === login);
        if (user) {
          User.findOne({login: login}).then(data => {
            if (!data.friendRequests.find(x => x.login === from)) {
              data.friendRequests.push({
                id: uuidv4(),
                login: from
              });
              data.message.unshift({
                message: `${from} пригласил вас в друзья`,
                type: 'friendRequest'
              })
              user.socket.emit('message');
              data.save();
              socket.emit('messageFriendRequest', {message: 'Зарос отправлен'});
            } else {
              socket.emit('messageFriendRequest', {message: 'Вы уже отправили запрос'});
            }
          });
        } else {
          User.findOne({login: login}).then(data => {
            if (data.friendRequests.find(x => x.login === from)) {
              data.friendRequests.push({
                id: uuidv4(),
                login: from
              });
              data.save();
              socket.emit('messageFriendRequest', {message: 'Зарос отправлен'});
            } else {
              socket.emit('messageFriendRequest', {message: 'Вы уже отправили запрос'});
            }
          });
        }
      }
    })
  });

  socket.on('deleteMessage', (data) => {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    User.findOne({login : connectUser.login}).then(res => {
      res.message.splice(data.index, 1);
      res.save();
      socket.emit('message');
    });
  });

  socket.on('acceptFriends', (data) => {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    User.findOne({login: connectUser.login}).then((dataConnectUser) => {
      let index = dataConnectUser.friendRequests.findIndex(x => x.id === data.id);
      dataConnectUser.friendRequests.splice(index, 1);
      dataConnectUser.friends.push({
        login: data.login
      });
      dataConnectUser.message.unshift({
        message: `${data.login} теперь у вас в друзьях`,
        type: 'acceptFriends'
      });
      socket.emit('message');
      dataConnectUser.save();
    })
    User.findOne({login: data.login}).then((dataLogin) => {
      dataLogin.friends.push({
        login: connectUser.login
      });
      dataLogin.message.unshift({
        message: `${connectUser.login} теперь у вас в друзьях`,
        type: 'acceptFriends'
      });
      socket.emit('message');
      dataLogin.save();
    })
  });

  socket.on('rejectFriend', (data) => {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    User.findOne({login: connectUser.login}).then((dataConnectUser) => {
      let index = dataConnectUser.friendRequests.findIndex(x => x.id === data.id);
      dataConnectUser.friendRequests.splice(index, 1);
      dataConnectUser.message.unshift({
        message: `Вы отклонили запров дружбу от ${data.login}`,
        type: 'acceptFriends'
      });
      socket.emit('message');
      dataConnectUser.save();
    })
    User.findOne({login: data.login}).then((dataLogin) => {
      dataLogin.message.unshift({
        message: `Пользователь ${connectUser.login} отклонил запрос в друзья`,
        type: 'acceptFriends'
      });
      socket.emit('message');
      dataLogin.save();
    })
  })

  socket.on('disconnect', (data) => {
    let user = connectedUsers.findIndex(x => x.socketId === socket.id);
    connectedUsers.splice(user, 1);
    console.log('disconnect');
  });

});



