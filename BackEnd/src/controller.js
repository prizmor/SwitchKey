const User = require('./modules/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('./config');
const { v4: uuidv4 } = require('uuid');


const generateToken = (userId) => {
  const payload = {
    userId
  };
  return jwt.sign(payload, secret, {expiresIn: '24h'});
}

const formattedDate = (d = new Date) => {
  return [d.getDate(), d.getMonth()+1, d.getFullYear()]
    .map(n => n < 10 ? `0${n}` : `${n}`).join('/');
}

class controller {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors)
      }
      const { login, password } = req.body;
      const candidate = await User.findOne({login});
      if (candidate) {
        return res.status(400).json({message: `Логин ${login} уже занят`});
      }
      const Password = bcrypt.hashSync(password, 7);
      const user = new User({login: login, password: Password});
      await user.save();
      return res.status(200).json('OK')
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'Register error'});
    }
  }
  async login(req, res) {
    try {
      const { login, password } = req.body;
      const user = await User.findOne({login});
      if (!user) {
        return res.status(400).json(`Не верный логин или пароль`);
      }
      const Password = bcrypt.compareSync(password, user.password)
      if (!Password) {
        return res.status(400).json(`Не верный логин или пароль`);
      }
      const token = generateToken(user._id);
      return res.status(200).json({token});
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'Login error'});
    }
  }

  async postHistory(req, res) {
    try {
      const { idText, err, litters, time } = req.body;
      if (!idText || !err || !litters || !time) {
        return res.status(400).json(`history params err`);
      }
      const userId = req.user.userId;
      const user = await User.findOne({_id: userId});
      if (!user) {
        return res.status(500).json(`server error`);
      }
      const pattern = {
        idText,
        err,
        litters,
        time,
        date: formattedDate(),
        id: uuidv4()
      };
      user.history.unshift(pattern);
      await user.save();
      return res.status(200).json("ok");
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'History error'});
    }
  }
  async deleteHistory(req, res) {
    try {
      res.json('ok')
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'History error'});
    }
  }
  async getHistory(req, res) {
    try {
      res.json('ok')
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'History error'});
    }
  }
  async getTextById(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findOne({_id: userId});
      if (!user) {
        return res.status(500).json(`server error`);
      }
      const text = user.text.find(x => x.id === req.params.id);
      if (textIndex < 0) {
        return res.status(400).json(`err id`);
      }
      return res.status(200).json(text);
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'Text error'});
    }
  }
  async getAllText(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findOne({_id: userId});
      if (!user) {
        return res.status(500).json(`server error`);
      }
      const text = user.text;
      return res.status(200).json(text);
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'Text error'});
    }
  }
  async postAddText(req, res) {
    try {
      const { name } = req.body;
      const userId = req.user.userId;
      const user = await User.findOne({_id: userId});
      if (!user) {
        return res.status(500).json(`server error`);
      }
      const text = {
        name: name,
        text: '',
        time: 30,
        id: uuidv4()
      }
      user.text.push(text);
      await user.save();
      return res.status(200).json('ok');
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'Text error'});
    }
  }
  async deleteText(req, res) {
    try {
      const { idText } = req.body;
      const userId = req.user.userId;
      const user = await User.findOne({_id: userId});
      if (!user) {
        return res.status(500).json(`server error`);
      }
      const textIndex = user.text.findIndex(x => x.id === idText);
      if (textIndex < 0) {
        return res.status(400).json(`id err`);
      }
      user.text.splice(textIndex, 1);
      await user.save();
      return res.status(200).json('ok');
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'Text error'});
    }
  }
  async putText(req, res) {
    try {
      const { id, text, time, name } = req.body;
      const userId = req.user.userId;
      const user = await User.findOne({_id: userId});
      if (!user) {
        return res.status(500).json(`server error`);
      }
      const textIndex = user.text.findIndex(x => x.id === id);
      const textByIndex = {...user.text[textIndex]};
      if (textIndex < 0) {
        return res.status(400).json(`id err`);
      }
      if (text) {
        textByIndex.text = text;
      }
      if (name) {
        textByIndex.name = name;
      }
      if (time) {
        textByIndex.time = Number(time);
      }
      user.text.splice(textIndex, 1, textByIndex);
      await user.save()
      return res.status(200).json(textByIndex);
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'Text error'});
    }
  }
}

module.exports = new controller();
