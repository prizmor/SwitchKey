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
    const historyIndex = user.history.findIndex(x => x.id === id);
    if (historyIndex < 0) {
      return res.status(400).json(`Не вырный ID`);
    }
    if (user.history.length === 1) {
      user.history = [];
    } else {
      user.history.splice(historyIndex, 1);
    }
    await user.save();
    return res.status(200).json({message: 'OK'})
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'History error'});
  }
}
