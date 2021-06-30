const register = require('./register');
const login = require('./login');
const getIdUserPasswordRecovery = require('./getIdUserPasswordRecovery');
const passwordRecovery = require('./passwordRecovery');

class controller {
  async register(req, res) {
    return await register(req, res);
  }
  async login(req, res) {
    return await login(req, res);
  }
  async getIdUserPasswordRecovery(req, res) {
    return await getIdUserPasswordRecovery(req, res);
  }
  async passwordRecovery(req, res) {
    return await passwordRecovery(req, res);
  }
}

module.exports = new controller();
