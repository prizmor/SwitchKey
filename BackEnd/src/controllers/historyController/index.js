const postHistory = require('./postHistory');
const deleteHistory = require('./deleteHistory');
const getHistory = require('./getHistory');

class controller {
  async postHistory(req, res) {
    return await postHistory(req, res);
  }
  async deleteHistory(req, res) {
    return await deleteHistory(req, res);
  }
  async getHistory(req, res) {
    return await getHistory(req, res);
  }
}

module.exports = new controller();
