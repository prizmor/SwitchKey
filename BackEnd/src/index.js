const express = require('express');
const mongoose = require('mongoose');
const router = require('./router');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/api', router);

const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://prizmor:prizmor@cluster0.fvqqb.mongodb.net/SwitchKey?retryWrites=true&w=majority`)
    app.listen(PORT, () => console.log('Server started, port: ' + PORT));
  } catch (e) {
    console.error('error');
  }
};

start();
