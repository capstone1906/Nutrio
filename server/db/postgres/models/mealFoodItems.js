const Sequelize = require('sequelize');
const db = require('../db');
const createMealFoodItems = require('../../neo4j/models/mealFoodItems');
const Meals = require('./meals');
const FoodItems = require('./foodItems');

const MealFoodItems = db.define('mealFoodItems', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  calories: {
<<<<<<< HEAD
    type: Sequelize.FLOAT,

  },
  quantity: {
    type: Sequelize.INTEGER,

=======
    type: Sequelize.INTEGER,
    // validate: {
    //   notEmpty: true,
    // },
  },
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    // validate: {
    //   notEmpty: true,
    // },
>>>>>>> 05403c2aed7c9d6073da04a272687310702ca33a
  },
  grams: {
    type: Sequelize.INTEGER, //added new property
  }
});



module.exports = MealFoodItems;

MealFoodItems.afterSave(async mealFoodItem => {
  const meal = await Meals.findByPk(mealFoodItem.mealId);
  const foodItem = await FoodItems.findByPk(mealFoodItem.foodItemId);
  const newCals = meal.totalCalories + foodItem.calories;
  const newCarbs = meal.totalCarbs + foodItem.carbohydrates;
  const newProtein = meal.totalProtein + foodItem.protein;
  const newFat = meal.totalFat + foodItem.fat;
  await meal.update(
    {
      totalCalories: newCals,
      totalCarbs: newCarbs,
      totalFat: newFat,
      totalProtein: newProtein,
    },
    { where: { id: mealFoodItem.mealId } }
  );

  const newMealItem = await createMealFoodItems(mealFoodItem);
  return newMealItem;
});

MealFoodItems.beforeDestroy(async mealFoodItem => {
  const meal = await Meals.findByPk(mealFoodItem.mealId);
  const foodItem = await FoodItems.findByPk(mealFoodItem.foodItemId);
  const newCals = meal.totalCalories - foodItem.calories;
  const newCarbs = meal.totalCarbs - foodItem.carbohydrates;
  const newProtein = meal.totalProtein - foodItem.protein;
  const newFat = meal.totalFat - foodItem.fat;
  await meal.update(
    {
      totalCalories: newCals,
      totalCarbs: newCarbs,
      totalFat: newFat,
      totalProtein: newProtein,
    },
    { where: { id: mealFoodItem.mealId } }
  );
});
