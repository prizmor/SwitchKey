const User = require('../../modules/user');

module.exports = async function (req, res) {
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
