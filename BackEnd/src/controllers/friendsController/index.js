const friendRequests = require('./friendRequests');
const getFriends = require('./getFriends');
const getBlocked = require('./getBlocked');

class controller {
  async friendRequests(req, res) {
    return await friendRequests(req, res);
  }
  async getFriends(req, res) {
    return await getFriends(req, res);
  }
  async getBlocked(req, res) {
    return await getBlocked(req, res);
  }
}

module.exports = new controller();
