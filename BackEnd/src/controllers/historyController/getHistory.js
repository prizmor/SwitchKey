const User = require('../../modules/user');

module.exports = async function (req, res) {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({_id: userId});
    if (!user) {
      return res.status(500).json(`server error`);
    }
    const size = Number(req.query.size);
    const page = Number(req.query.page) - 1;

    let pages = [];
    for (let i = 0; i < Math.ceil(user.history.length/size); i++){
      pages[i] = user.history.slice((i*size), (i*size) + size);
    }

    console.log(pages[page])

    res.status(200).json({
      items: pages[page],
      pages: pages.length,
      size,
      page
    });

  } catch (e) {
    console.log(e);
    res.status(400).json({message: 'History error'});
  }
}
