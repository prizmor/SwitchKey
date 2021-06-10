const {Schema, model} = require('mongoose');

const User = new Schema({
  login: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  history: [{type: Object }],
  text: [{type: Object}]
});

module.exports = model('User', User);
