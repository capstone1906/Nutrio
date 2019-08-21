const Sequelize = require('sequelize');
const db = require('../db');
const createUserMeal = require('../../neo4j/models/userMeals');
const MealFoodItems = require('./mealFoodItems');
const UserFoods = require('./userFoods');

const UserMeals = db.define('userMeals', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  timesEaten: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
});

module.exports = UserMeals;

UserMeals.beforeValidate(async userMeal => {
  const prevMeal = await UserMeals.findOne({
    where: { userId: userMeal.userId, mealId: userMeal.mealId },
  });
  if (prevMeal) {
    userMeal.timesEaten += prevMeal.timesEaten;
    await prevMeal.destroy();
  }
});

UserMeals.afterSave(async userMeal => {
  await MealFoodItems.findAll({
    where: { mealId: userMeal.mealId },
  }).map(async foodItem => {
    await UserFoods.create({
      userId: userMeal.userId,
      foodItemId: foodItem.foodItemId,
    });
  });

  const newUserMeal = await createUserMeal(userMeal);
  return newUserMeal;
});
