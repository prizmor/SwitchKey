const DataBase = require('../../dataBase');

module.exports = async function (data, socket, connectedUsers) {
  try {
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
  } catch (e) {
    console.log(e);
  }
}
