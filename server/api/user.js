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
<<<<<<< HEAD
=======

router.post('/', async (req, res, next) => {
  try {
    const addUser = await Users.findOrCreate({});
    res.json(addUser);
  } catch (err) {
    next(err);
  }
});
>>>>>>> 1a64a55554b5661883550c2b08bbd907288a0f40
