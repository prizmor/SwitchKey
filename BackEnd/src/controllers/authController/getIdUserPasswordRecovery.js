const User = require('../../modules/user');

module.exports = async function (req, res) {
  try {
    const {login, email} = req.query;
    if (!login || !email) {
      console.log(login + ' ' + email);
      return res.status(400).json({message: `Не переданы параметры`});
    }
    const user = await User.findOne({login});
    if (!user) {
      return res.status(400).json({message: `Логин ${login} не найден`});
    }
    if (user.email !== email) {
      return res.status(400).json({message: `Почта ${email} не совподает`});
    }
    const idUser = bcrypt.hashSync(user.id, 7);
    return res.status(200).json({idUser: idUser});
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'PasswordRecovery error'});
  }
}
