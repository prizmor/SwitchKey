const DataBase = require('../../dataBase');

module.exports = async function (data, socket, connectedUsers) {
  try {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    let user = await DataBase.getUser(connectUser.login);
    let blockedUserIndex =  user.blackList.findIndex(x => x.login === data.login);
    user.blackList.splice(blockedUserIndex, 1);
    user.message.unshift({
      message: `Пользователь ${data} был разблокирован`
    })
    user.save();
    socket.emit('message');
  } catch (e) {
    console.log(e);
  }
}
