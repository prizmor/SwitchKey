const DataBase = require('../../dataBase');

module.exports = async function (data, socket, connectedUsers) {
  try {
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
  } catch (e) {
    console.log(e);
  }
}
