const DataBase = require('../../dataBase');

module.exports = async function (data, socket, connectedUsers) {
  try {
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
  } catch (e) {
    console.log(e);
  }
}
