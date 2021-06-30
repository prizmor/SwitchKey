const User = require('../../modules/user');

module.exports = async function (req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({message: `Не переданы параметры`});
    }
    const userId = req.user.userId;
    const user = await User.findOne({_id: userId});
    if (!user) {
      return res.status(500).json(`server error`);
    }
    const textIndex = user.text.findIndex(x => x.id === id);
    if (textIndex < 0) {
      return res.status(400).json({message: `Не верный ID`
      });
    }
    user.text.splice(textIndex, 1);
    await user.save();
    return res.status(200).json({message: 'OK'})
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'Text error'});
  }
}
