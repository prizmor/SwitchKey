const User = require('../../modules/user');

module.exports = async function (req, res) {
  try {
    const userId = req.user.userId;
    const { login } = req.params;
    const user = await User.findOne({_id: userId});
    if (!user) {
      return res.status(500).json(`server error`);
    }
    let profile = await User.findOne({login: login});
    return res.status(200).json({profile: {
        login: profile.login,
        online: profile.online,
        history: profile.history
      }})
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'Profile error'})
  }
}
