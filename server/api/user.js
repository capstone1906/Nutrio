const router = require('express').Router();
const { Users } = require('../db/postgres/models/index');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const me = await Users.findOne({
      where: {
        id: 1, //fix later
      },
      include: [{ all: true }],
    });

    res.json(me);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const addUser = await Users.findOrCreate({});
    res.json(addUser);
  } catch (err) {
    next(err);
  }
});
