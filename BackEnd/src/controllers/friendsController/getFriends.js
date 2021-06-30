const User = require('../../modules/user');

module.exports = async function (req, res) {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({_id: userId});
    if (!user) {
      return res.status(500).json(`server error`);
    }
    let friends = [];
    for (let i = 0; i < user.friends.length; i++) {
      let friend = await User.findOne({login: user.friends[i].login});
      friends.push({
        login: friend.login,
        online: friend.online
      });
    }
    return res.status(200).json({friends: friends})
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'Friends error'})
  }
}
