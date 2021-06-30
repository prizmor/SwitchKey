const User = require('../../modules/user');

module.exports = async function (req, res) {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({_id: userId});
    if (!user) {
      return res.status(500).json(`server error`);
    }
    return res.status(200).json({message: user.message})
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'Message error'})
  }
}
