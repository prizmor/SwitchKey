const logout = require('./modules/logout');
const friendRequest = require('./modules/friendRequest');
const deleteMessage = require('./modules/deleteMessage');
const acceptFriends = require('./modules/acceptFriends');
const rejectFriend = require('./modules/rejectFriend');
const blockedUser = require('./modules/blockedUser');
const unblockUser = require('./modules/unblockUser');
const deleteFriend = require('./modules/deleteFriend');
const online = require('./modules/online');
const DataBase = require('./../dataBase');
const jwt = require('jsonwebtoken');

module.exports = function(io) {
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
      logout(data, socket, connectedUsers);
    });

    socket.on('friendRequest', async (data) => {
      await friendRequest(data, socket, connectedUsers);
    });

    socket.on('deleteMessage', async (data) => {
      await deleteMessage(data, socket, connectedUsers);
    });

    socket.on('acceptFriends', async (data) => {
      await acceptFriends(data, socket, connectedUsers);
    });

    socket.on('rejectFriend', async (data) => {
      await rejectFriend(data, socket, connectedUsers);
    })

    socket.on('blockedUser', async (data) => {
      await blockedUser(data, socket, connectedUsers);
    });

    socket.on('unblockUser', async (data) => {
      await unblockUser(data, socket, connectedUsers);
    })

    socket.on('deleteFriend', async (data) => {
      console.log(data);
      await deleteFriend(data, socket, connectedUsers);
    });

    socket.on('online', async (data) => {
      await online(data, socket, connectedUsers);
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
};
