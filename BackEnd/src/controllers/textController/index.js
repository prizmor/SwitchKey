const getTextById = require('./getTextById');
const getAllText = require('./getAllText');
const postAddText = require('./postAddText');
const deleteText = require('./deleteText');
const putText = require('./putText');

class controller {
  async getTextById(req, res) {
    return await getTextById(req, res);
  }
  async getAllText(req, res) {
    return await getAllText(req, res);
  }
  async postAddText(req, res) {
    return await postAddText(req, res);
  }
  async deleteText(req, res) {
    return await deleteText(req, res);
  }
  async putText(req, res) {
    return await putText(req, res);
  }
}

module.exports = new controller();
