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
    type: Sequelize.FLOAT,
  },
  quantity: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
  },
  grams: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = MealFoodItems;

MealFoodItems.afterSave(async (mealFoodItem, options) => {
  let totalCalories = 0;
  let carbs = 0;
  let fat = 0;
  let protein = 0;
  await MealFoodItems.findAll({
    where: { mealId: mealFoodItem.mealId },
    transaction: options.transaction,
  }).map(async mealItem => {
    let foodItem = await FoodItems.findByPk(mealItem.foodItemId, {
      transaction: options.transaction,
    });
    let unit = 0;
    if (mealItem.quantity > 0) {
      unit = mealItem.quantity;
    } else {
      unit = mealItem.grams / foodItem.weight;
    }

    totalCalories += foodItem.calories * unit;
    carbs += foodItem.carbohydrates * unit;
    fat += foodItem.fat * unit;
    protein += foodItem.protein * unit;
  });
  const meal = await Meals.findByPk(mealFoodItem.mealId, {
    transaction: options.transaction,
  });

  //query all data each time and replace meal cals

  await meal.update(
    {
      totalCalories: totalCalories,
      totalCarbs: carbs,
      totalFat: fat,
      totalProtein: protein,
    },
    { where: { id: mealFoodItem.mealId }, transaction: options.transaction }
  );

  const newMealItem = await createMealFoodItems(mealFoodItem);
  return newMealItem;
});

MealFoodItems.beforeCreate(async mealFoodItem => {
  const foodItem = await FoodItems.findByPk(mealFoodItem.foodItemId);
  let unit = 0;
  if (mealFoodItem.quantity > 0) {
    unit = mealFoodItem.quantity;
  } else {
    unit = mealFoodItem.grams / foodItem.weight;
  }
  mealFoodItem.calories = unit * foodItem.calories;
});

MealFoodItems.beforeDestroy(async mealFoodItem => {
  const meal = await Meals.findByPk(mealFoodItem.mealId);
  const foodItem = await FoodItems.findByPk(mealFoodItem.foodItemId);
  let unit = 0;
  if (mealFoodItem.quantity > 0) {
    unit = mealFoodItem.quantity;
  } else {
    unit = mealFoodItem.grams / foodItem.weight;
  }
  const newCals = meal.totalCalories - foodItem.calories * unit;
  const newCarbs = meal.totalCarbs - foodItem.carbohydrates * unit;
  const newProtein = meal.totalProtein - foodItem.protein * unit;
  const newFat = meal.totalFat - foodItem.fat * unit;
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
