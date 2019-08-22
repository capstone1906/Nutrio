const router = require('express').Router();
const { Users, DailyGoals, LongTermGoals } = require('../db/postgres/models/index');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const me = await Users.findOne({
      where: {
        id: 1, //fix later
      },
      include: [DailyGoals, LongTermGoals],
    });

    res.json(me);
  } catch (err) {
    next(err);
  }
});
