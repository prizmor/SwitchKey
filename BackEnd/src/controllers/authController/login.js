const User = require('../../modules/user');
const jwt = require('jsonwebtoken');
const { secret } = require('../../config');
const bcrypt = require('bcryptjs');

const generateToken = (userId) => {
  const payload = {
    userId
  };
  return jwt.sign(payload, secret, {expiresIn: '24h'});
}

module.exports = async function (req, res) {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).json({message: `Не переданы параметры`});
    }
    const user = await User.findOne({login});
    if (!user) {
      return res.status(400).json({message: `Не верный логин или пароль`
      });
    }
    const Password = bcrypt.compareSync(password, user.password)
    if (!Password) {
      return res.status(400).json({message: `Не верный логин или пароль`
      });
    }
    const token = generateToken(user._id);
    return res.status(200).json({token, login: user.login});
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'Login error'});
  }
}
