const DataBase = require('../../dataBase');

module.exports = async function (data, socket, connectedUsers) {
  try {
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
  } catch (e) {
    console.log(e);
  }
}
