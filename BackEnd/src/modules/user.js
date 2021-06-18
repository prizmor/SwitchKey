const {Schema, model} = require('mongoose');

const User = new Schema({
  login: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  history: [{type: Object }],
  text: [{type: Object}],
  status: {type: String},
  friendRequests: [{type: Object}],
  friends: [{type: Object}],
  message: [{type: Object}]
});

module.exports = model('User', User);
