const User = require('./modules/user');

class DataBase {

  getUser(login, id) {
    if (login) {
      return User.findOne({login: login})
    } else if (id) {
      return User.findOne({_id: id})
    }

  }

}

module.exports = new DataBase();
