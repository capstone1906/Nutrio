const router = require('express').Router();
const {
  Meals,
  FoodItems,
  MealFoodItems,
  UserMeals,
} = require('../db/postgres/models/index');
const { getRecommendedMeals } = require('../db/neo4j/models/meals');
module.exports = router;

router.get('/:userId', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const mealFoodItems = await UserMeals.findAll({
      where: {
        userId: userId,
      },
    });
    const meals = mealFoodItems.map(m => {
      return Meals.findOne({
        where: {
          id: m.mealId,
        },
        include: [FoodItems],
      });
    });
    const response = await Promise.all(meals);
    const dateNow = new Date();
    var todaysDate;

    var year = dateNow.getFullYear().toString();
    var month = (dateNow.getMonth() + 1).toString();
    var day = dateNow.getDate().toString();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    todaysDate = year + '-' + month + '-' + day;
    var todaysMeals = [];

    for (let i = 0; i < response.length; i++) {
      var time = response[i].dataValues.createdAt;
      var newyear = time.getFullYear().toString();
      var newmonth = (time.getMonth() + 1).toString();
      var newday = time.getDate().toString();

      if (newmonth < 10) {
        newmonth = '0' + newmonth;
      }
      if (newday < 10) {
        newday = '0' + newday;
      }

      var newDate = newyear + '-' + newmonth + '-' + newday;
      if (newDate === todaysDate) {
        todaysMeals.push(response[i]);
      }
    }

    if (todaysMeals.length < 1) {
      var breakfast = await Meals.create({
        entreeType: 'Breakfast',
        totalCalories: 0,
        averageRating: 2.0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        dominantMacro: 'protein',
      });
      await UserMeals.create({
        userId: userId,
        mealId: breakfast.dataValues.id,
      });
      var Lunch = await Meals.create({
        userId: userId,
        entreeType: 'Lunch',
        totalCalories: 0,
        averageRating: 2.0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        dominantMacro: 'protein',
      });
      await UserMeals.create({
        userId: userId,
        mealId: Lunch.dataValues.id,
      });
      var Dinner = await Meals.create({
        userId: userId,
        entreeType: 'Dinner',
        totalCalories: 0,
        averageRating: 2.0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        dominantMacro: 'protein',
      });
      await UserMeals.create({
        userId: userId,
        mealId: Dinner.dataValues.id,
      });
      var Snacks = await Meals.create({
        userId: userId,
        entreeType: 'Snacks',
        totalCalories: 0,
        averageRating: 2.0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        dominantMacro: 'protein',
      });
      await UserMeals.create({
        userId: userId,
        mealId: Snacks.dataValues.id,
      });
      todaysMeals.push(breakfast, Lunch, Dinner, Snacks);
    }

    const mealFoodItems2 = await UserMeals.findAll({
      where: {
        userId: userId,
      },
    });
    const meals2 = mealFoodItems2.map(m => {
      return Meals.findOne({
        where: {
          id: m.mealId,
        },
        include: [FoodItems],
      });
    });
    const response2 = await Promise.all(meals);
    res.json(response2);
  } catch (err) {
    next(err);
  }
});

router.get('/recommendedMeals/:entreeType', async (req, res, next) => {
  const meal = {
    calories: Number(req.query.calories),
    carbs: Number(req.query.carbs),
    protein: Number(req.query.protein),
    fat: Number(req.query.fat),
    type: req.params.entreeType,
  };
  try {
    const meals = await getRecommendedMeals(meal);
    const mealsRes = meals.map(m => {
      return Meals.findOne({
        where: {
          id: m,
        },
        include: [FoodItems],
      });
    });
    const response = await Promise.all(mealsRes);
    res.json(response);
  } catch (err) {
    next(err);
  }
});
