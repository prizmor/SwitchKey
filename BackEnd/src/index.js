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
const {v4: uuidv4} = require('uuid');
const DataBase = require('./dataBase')

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

io.on("connection", async (socket) => {
  if (!socket.handshake.auth.token) {
    socket.disconnect();
  } else {
    const decodedData = jwt.verify(socket.handshake.auth.token, 'SECRET_KEY_RANDOM');
    let data = await DataBase.getUser(false, decodedData.userId);
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
        data.online = true;
        data.save();
        console.log('connect ' + data.login);
        socket.emit('resetProfile');
        for (let i = 0; i < data.friends.length; i++) {
          let friend =  connectedUsers.find(x => x.login === data.friends[i].login);
          if (friend) {
            friend.socket.emit('resetFriends');
          }
        }
      }
    }
  }
  socket.on('logout', (data) => {
    socket.disconnect();
  });

  socket.on('friendRequest', async ({login, from}) => {
    let loginUser = await DataBase.getUser(login);
    let fromUser = await DataBase.getUser(from);
    let blockedLogin = loginUser.blackList.findIndex(x => x.login === from);
    let blockedFrom = fromUser.blackList.findIndex(x => x.login === login);
    console.log(blockedLogin, blockedFrom)
    if (!loginUser || login === from || blockedLogin >= 0 || blockedFrom >= 0) {
      socket.emit('messageFriendRequest', {message: 'Не найден'});
      console.log(true)
    } else {
      let user = connectedUsers.find(x => x.login === login);
      if (user) {
        let data = await DataBase.getUser(login);
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
      } else {
        let data = await DataBase.getUser(login);
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
      }
    }
  });

  socket.on('deleteMessage', async (data) => {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    let res = await DataBase.getUser(connectUser.login);
    res.message.splice(data.index, 1);
    res.save();
    socket.emit('message');
  });

  socket.on('acceptFriends', async (data) => {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    let dataConnectUser = await DataBase.getUser(connectUser.login)
    let dataLogin = await DataBase.getUser(data.login)
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
    dataLogin.friends.push({
      login: connectUser.login
    });
    dataLogin.message.unshift({
      message: `${connectUser.login} теперь у вас в друзьях`,
      type: 'acceptFriends'
    });
    socket.emit('message');
    dataLogin.save();
  });

  socket.on('rejectFriend', async (data) => {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    let user = connectedUsers.find(x => x.login === data.login);
    let dataConnectUser = await DataBase.getUser(connectUser.login);
    let dataLogin = await DataBase.getUser(data.login);
    let index = dataConnectUser.friendRequests.findIndex(x => x.id === data.id);
    dataConnectUser.friendRequests.splice(index, 1);
    dataConnectUser.message.unshift({
      message: `Вы отклонили запров дружбу от ${data.login}`,
      type: 'acceptFriends'
    });
    socket.emit('message');
    dataConnectUser.save();
    dataLogin.message.unshift({
      message: `Пользователь ${connectUser.login} отклонил запрос в друзья`,
      type: 'acceptFriends'
    });
    user.socket.emit('message');
    dataLogin.save();
  })

  socket.on('blockedUser', async (data) => {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    let dataConnectUser = await DataBase.getUser(connectUser.login);
    let dataBlockedUser = await DataBase.getUser(data.login);
    let userBlocked = dataConnectUser.friends.findIndex(x => x.login === data.login);
    dataConnectUser.friends.splice(userBlocked, 1);
    dataConnectUser.blackList.push({
      login: data.login
    });
    dataConnectUser.message.push({
      message: `Пользователь ${data.login} был успешно заблокирован`,
      type: 'userBlocked'
    })
    socket.emit('message')
    dataConnectUser.save();
    let deleteUser = dataBlockedUser.friends.findIndex(x => x.login === connectUser.login);
    dataBlockedUser.friends.splice(deleteUser, 1);
    dataBlockedUser.save();
  });

  socket.on('unblockUser', async (data) => {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    let user = await DataBase.getUser(connectUser.login);
    let blockedUserIndex =  user.blackList.findIndex(x => x.login === data.login);
    user.blackList.splice(blockedUserIndex, 1);
    user.message.unshift({
      message: `Пользователь ${data} был разблокирован`
    })
    user.save();
    socket.emit('message');
  })

  socket.on('deleteFriend', async (data) => {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    let connectDeleteUser = connectedUsers.find(x => x.login === data.login);
    let user = await DataBase.getUser(connectUser.login);
    let deleteUser = await DataBase.getUser(data.login);

    let userIndex = deleteUser.friends.findIndex(x => x.login === user.login);
    let deleteUserIndex = user.friends.findIndex(x => x.login === deleteUser.login);

    user.friends.splice(deleteUserIndex, 1);
    deleteUser.friends.splice(userIndex, 1);

    user.message.unshift({
      message: `Пользователь ${data.login} был удалён`,
      type: 'deleteUser'
    })
    deleteUser.message.unshift({
      message: `Пользователь ${connectUser.login} удалил вас из друзей`,
      type: 'deleteUser'
    })

    user.save();
    deleteUser.save();

    connectUser.socket.emit('message');
    connectDeleteUser.socket.emit('message');
  });

  socket.on('online', async () => {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    let user = await DataBase.getUser(connectUser.login);
    user.online = !user.online;
    user.save();
    for (let i = 0; i < user.friends.length; i++) {
      let friend =  connectedUsers.find(x => x.login === user.friends[i].login);
      if (friend) {
        friend.socket.emit('resetFriends');
      }
    }
    socket.emit('resetProfile');
  });

  socket.on('disconnect', async () => {
    let userIndex = connectedUsers.findIndex(x => x.socketId === socket.id);
    let user = connectedUsers.find(x => x.socketId === socket.id);
    let data = await DataBase.getUser(user.login);
    data.online = false;
    data.save();
    connectedUsers.splice(userIndex, 1);
    console.log('disconnect');
    for (let i = 0; i < data.friends.length; i++) {
      let friend =  connectedUsers.find(x => x.login === data.friends[i].login);
      if (friend) {
        friend.socket.emit('resetFriends');
      }
    }
  });

});



