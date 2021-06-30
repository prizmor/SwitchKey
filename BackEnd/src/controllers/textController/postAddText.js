const User = require('../../modules/user');

module.exports = async function (req, res) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({message: `Не переданы параметры`});
    }
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
    return res.status(200).json({id: text.id})
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'Text error'});
  }
}
