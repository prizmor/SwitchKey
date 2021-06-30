const DataBase = require('../../dataBase');

module.exports = async function (data, socket, connectedUsers) {
  try {
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
  } catch (e) {
    console.log(e);
  }
}
