const router = require("express").Router();
const { CheckIns } = require("../db/postgres/models/index");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const checkIns = await CheckIns.findAll({
      where: {
        userId: 1
      }
    });

    const dateNow = new Date();
    var todaysDate;

    var year = dateNow.getFullYear().toString();
    var month = (dateNow.getMonth() + 1).toString();
    var day = dateNow.getDate().toString();

    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    todaysDate = year + "-" + month + "-" + day;
    var todaysCheckIn = {};

    for (let i = 0; i < checkIns.length; i++) {
      var time = checkIns[i].dataValues.createdAt;
      var newyear = time.getFullYear().toString();
      var newmonth = (time.getMonth() + 1).toString();
      var newday = time.getDate().toString();

      if (newmonth < 10) {
        newmonth = "0" + newmonth;
      }
      if (newday < 10) {
        newday = "0" + newday;
      }

      var newDate = newyear + "-" + newmonth + "-" + newday;
      if (newDate === todaysDate) {
        todaysCheckIn = checkIns[i];
      }
    }

    if (!todaysCheckIn.createdAt) {
      todaysCheckIn = await CheckIns.create({
        userId: 1
      });
    }

    res.json({ checkIns, todaysCheckIn });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const todaysCheckIn = await CheckIns.findOne({
      where: {
        id: req.params.id
      }
    });

    var newCaloriesBurned =
      parseInt(todaysCheckIn.caloriesBurned) +
      parseInt(req.body.caloriesBurned || 0);

    await todaysCheckIn.update({
      caloriesBurned: newCaloriesBurned,
      weight: req.body.weight
    });

    res.json(todaysCheckIn);
  } catch (err) {
    next(err);
  }
});
