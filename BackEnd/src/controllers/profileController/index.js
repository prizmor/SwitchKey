const getProfile = require('./getProfile');

class controller {
  async getProfile(req, res) {
    return await getProfile(req, res);
  }
}

module.exports = new controller();
