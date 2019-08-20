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
    type: Sequelize.INTEGER,
  },
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  grams: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = MealFoodItems;

MealFoodItems.afterSave(async mealFoodItem => {
  const meal = await Meals.findByPk(mealFoodItem.mealId);
  const foodItem = await FoodItems.findByPk(mealFoodItem.foodItemId);
  let unit = 0;
  if (mealFoodItem.quantity > 0) {
    unit = mealFoodItem.quantity;
  } else {
    unit = mealFoodItem.grams / foodItem.weight;
  }
  const newCals = meal.totalCalories + foodItem.calories * unit;
  const newCarbs = meal.totalCarbs + foodItem.carbohydrates * unit;
  const newProtein = meal.totalProtein + foodItem.protein * unit;
  const newFat = meal.totalFat + foodItem.fat * unit;
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
