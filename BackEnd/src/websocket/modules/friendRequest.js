const DataBase = require('../../dataBase');
const {v4: uuidv4} = require('uuid');

module.exports = async function ({login, from}, socket, connectedUsers) {
  try {
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
  } catch (e) {
    console.log(e);
  }
}
