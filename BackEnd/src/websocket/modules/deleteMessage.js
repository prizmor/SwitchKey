const DataBase = require('../../dataBase');

module.exports = async function (data, socket, connectedUsers) {
  try {
    let connectUser = connectedUsers.find(x => x.socketId === socket.id);
    let res = await DataBase.getUser(connectUser.login);
    res.message.splice(data.index, 1);
    res.save();
    socket.emit('message');
  } catch (e) {
    console.log(e);
  }
}
