const User = require('../../modules/user');

module.exports = async function (req, res) {
  try {
    const {login, userId, password} = req.body;
    if (!userId || !password || !login) {
      return res.status(400).json({message: `Не переданы параметры`});
    }
    const user = await User.findOne({login});
    if (!user) {
      return res.status(400).json({message: `Логин ${login} не найден`});
    }
    const id = bcrypt.compareSync(user.id, userId)
    if (!id) {
      return res.status(400).json({message: `Не верный id`});
    }
    user.password = bcrypt.hashSync(password, 7);
    await user.save();
    return res.status(200).json({message: 'OK'});
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'PasswordRecovery error'});
  }
}
