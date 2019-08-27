const router = require("express").Router();
const {
  Meals,
  FoodItems,
  MealFoodItems,
  UserMeals,
  Users
} = require("../db/postgres/models/index");
const { getRecommendedMeals } = require("../db/neo4j/models/meals");
module.exports = router;

router.get("/:userId", async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const mealFoodItems = await UserMeals.findAll({
      where: {
        userId: userId
      }
    });

    const me = await Users.findOne({
      where: {
        id: userId
      }
    })

    const meals = mealFoodItems.map(m => {
      return Meals.findOne({
        where: {
          id: m.mealId
        },
        include: [FoodItems]
      });
    });

    const response = await Promise.all(meals);

    var givenDate = req.query.date;
    var dateNow;
    var year;
    var month;
    var day;

    if (givenDate.split("").length > 1) {
      dateNow = new Date(givenDate);
      year = dateNow.getFullYear().toString();
      month = (dateNow.getMonth() + 1).toString();
      day = (dateNow.getDate() + 1).toString();
    } else {
      dateNow = new Date();
      year = dateNow.getFullYear().toString();
      month = (dateNow.getMonth() + 1).toString();
      day = dateNow.getDate().toString();
    }

    var todaysDate;

    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    todaysDate = year + "-" + month + "-" + day;

    dateNow = new Date(todaysDate);

    var todaysMeals = [];

    for (let i = 0; i < response.length; i++) {
      var time = response[i].dataValues.createdAt;
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
        todaysMeals.push(response[i]);
      }
    }

    if (todaysMeals.length < 1) {

      day = (dateNow.getDate() + 1).toString();

      if (month < 10) {
        month = "0" + month;
      }

      if (day < 10) {
        day = "0" + day;
      }


      todaysDate = year + "-" + month + "-" + day

      dateNow = new Date(todaysDate);

      month = month.split('').splice(1,2).join('')
      todaysDate = year + "/" + month + "/" + day


      

      var breakfast = await Meals.create({
        entreeType: "Breakfast",
        totalCalories: 0,
        averageRating: 2.0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        dominantMacro: "protein",
        createdAt: dateNow,
        name: me.firstName + 's' + ` breakfast ${todaysDate}`
      });
      await UserMeals.create({
        userId: userId,
        mealId: breakfast.dataValues.id
      });
      var Lunch = await Meals.create({
        userId: userId,
        entreeType: "Lunch",
        totalCalories: 0,
        averageRating: 2.0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        dominantMacro: "protein",
        createdAt: dateNow,
        name: me.firstName + 's' + ` lunch ${todaysDate}`
      });
      await UserMeals.create({
        userId: userId,
        mealId: Lunch.dataValues.id,
        createdAt: dateNow,
      });
      var Dinner = await Meals.create({
        userId: userId,
        entreeType: "Dinner",
        totalCalories: 0,
        averageRating: 2.0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        dominantMacro: "protein",
        createdAt: dateNow,
        name: me.firstName + 's' + ` dinner ${todaysDate}`
      });
      await UserMeals.create({
        userId: userId,
        mealId: Dinner.dataValues.id,
        createdAt: dateNow
      });
      var Snacks = await Meals.create({
        userId: userId,
        entreeType: "Snacks",
        totalCalories: 0,
        averageRating: 2.0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        dominantMacro: "protein",
        createdAt: dateNow,
        name: me.firstName + 's' + ` snacks ${todaysDate}`

      });
      await UserMeals.create({
        userId: userId,
        mealId: Snacks.dataValues.id,
        createdAt: dateNow
      });
      todaysMeals.push(breakfast, Lunch, Dinner, Snacks);
    }

    const userMeals = await UserMeals.findAll({
      where: {
        userId: userId
      }
    });

    const meals2 = userMeals.map(m => {
      return Meals.findOne({
        where: {
          id: m.mealId
        },
        include: [FoodItems]
      });
    });

    const response2 = await Promise.all(meals2);

    res.json(response2);
  } catch (err) {
    next(err);
  }
});

router.get("/recommendedMeals/:entreeType", async (req, res, next) => {
  const meal = {
    calories: Number(req.query.calories),
    carbs: Number(req.query.carbs),
    protein: Number(req.query.protein),
    fat: Number(req.query.fat),
    type: req.params.entreeType
  };
  try {
    const meals = await getRecommendedMeals(meal);
    const mealsRes = meals.map(m => {
      return Meals.findOne({
        where: {
          id: m
        },
        include: [FoodItems]
      });
    });
    const response = await Promise.all(mealsRes);
    res.json(response);
  } catch (err) {
    next(err);
  }
});
