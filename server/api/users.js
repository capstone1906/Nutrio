const router = require('express').Router();
const { Users, DailyGoals, LongTermGoals } = require('../db/postgres/models/index');
module.exports = router;


router.get('/:email', async (req, res, next) => {
  try {
    const me = await Users.findOne({
      where: {
        email: req.params.email
      },
      include: [DailyGoals, LongTermGoals],
    });

    res.json(me);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const me = await Users.findOne({
      where: {
        id: 1, //fix later
      },
    });

    const longTermGoal = await LongTermGoals.findOne({
      where: {
        userId: 1 //fix later
      }
    })

    await me.update({
      height: req.body.height,
      weight: req.body.weight,
      activityLevel: req.body.activityLevel,
      bodyType: req.body.bodyType,
    })

    await longTermGoal.update({
      startWeight: req.body.startWeight,
      endingWeight: req.body.endingWeight,
      // startDate: req.body.startDate,
      // endDate: req.body.endDate,
      statedGoal: req.body.statedGoal,
    })



    res.json(me);
  } catch (err) {
    next(err);
  }
});
