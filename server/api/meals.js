const router = require("express").Router();
const { Meals } = require("../db/postgres/models/index");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const meals = await Meals.findAll({
      include: [{ all: true }]
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
    var todaysMeals = [];

    for (let i = 0; i < meals.length; i++) {
      var time = meals[i].dataValues.createdAt;
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
        todaysMeals.push(meals[i]);
      }
    }

    if (todaysMeals.length < 1) {
      var breakfast = await Meals.create({
        userId: 1,
        entreeType: "Breakfast",
        totalCalories: 0,
        averageRating: 2.0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        dominantMacro: "protein"
      });
      var Lunch = await Meals.create({
        userId: 1,
        entreeType: "Lunch",
        totalCalories: 0,
        averageRating: 2.0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        dominantMacro: "protein"
      });
      var Dinner = await Meals.create({
        userId: 1,
        entreeType: "Dinner",
        totalCalories: 0,
        averageRating: 2.0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        dominantMacro: "protein"
      });
      var Snacks = await Meals.create({
        userId: 1,
        entreeType: "Snacks",
        totalCalories: 0,
        averageRating: 2.0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        dominantMacro: "protein"
      });

      todaysMeals.push(breakfast, Lunch, Dinner, Snacks);
    }

    const meals2 = await Meals.findAll({
      include: [{ all: true }]
    });

    res.json(meals2);
  } catch (err) {
    next(err);
  }
});
