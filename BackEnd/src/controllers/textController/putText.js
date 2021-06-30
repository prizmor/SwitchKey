const User = require('../../modules/user');

module.exports = async function (req, res) {
  try {
    const { id, text, time, name } = req.body;
    if (!id) {
      return res.status(400).json({message: `Не переданы параметры`});
    }
    const userId = req.user.userId;
    const user = await User.findOne({_id: userId});
    if (!user) {
      return res.status(500).json(`server error`);
    }
    const textIndex = user.text.findIndex(x => x.id === id);
    const textByIndex = {...user.text[textIndex]};
    if (textIndex < 0) {
      return res.status(400).json({message: `Не верный ID`});
    }
    if (text || text === '') {
      textByIndex.text = text;
    }
    if (name) {
      textByIndex.name = name;
    }
    if (time) {
      textByIndex.time = Number(time);
    }
    user.text.splice(textIndex, 1, textByIndex);
    await user.save()
    return res.status(200).json(textByIndex);
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'Text error'});
  }
}
