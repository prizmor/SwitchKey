const getMessage = require('./getMessage');

class controller {
  async getMessage(req, res) {
    return await getMessage(req, res);
  }
}

module.exports = new controller();
