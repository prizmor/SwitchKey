const User = require('../../modules/user');

const formattedDate = (d = new Date) => {
  return [d.getDate(), d.getMonth()+1, d.getFullYear()]
    .map(n => n < 10 ? `0${n}` : `${n}`).join('.');
}

module.exports = async function (req, res) {
  try {
    const { idText, err, litters, time, name } = req.body;
    const userId = req.user.userId;
    const user = await User.findOne({_id: userId});
    if (!user) {
      return res.status(500).json(`server error`);
    }
    const pattern = {
      idText,
      name,
      err,
      litters,
      time,
      date: formattedDate(),
      id: uuidv4()
    };
    user.history.unshift(pattern);
    await user.save();
    return res.status(200).json({message: 'OK'})
  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'History error'});
  }
}
