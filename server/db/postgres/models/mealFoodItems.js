const Sequelize = require('sequelize');
const db = require('../db');
const createMealFoodItems = require('../../neo4j/models/mealFoodItems');
const Meals = require('./meals');
const FoodItems = require('./foodItems');
const totalCalculator = require('./helper');
const { createMeal } = require('../../neo4j/models/meals');

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
  carbs: {
    type: Sequelize.FLOAT,
  },
  fat: {
    type: Sequelize.FLOAT,
  },
  protein: {
    type: Sequelize.FLOAT,
  },
});

module.exports = MealFoodItems;

MealFoodItems.afterSave(async mealFoodItem => {
  const newMealItem = await createMealFoodItems(mealFoodItem);
  const meal = await Meals.findByPk(mealFoodItem.mealId);
  const total = await totalCalculator(mealFoodItem);
  total.id = meal.id;
  total.name = meal.name;
  total.entreeType = meal.entreeType;
  await createMeal(total);
  return newMealItem;
});

MealFoodItems.beforeCreateSeed = async mealFoodItem => {
  const foodItem = await FoodItems.findByPk(mealFoodItem.foodItemId);
  let unit = 1;
  if (mealFoodItem.quantity > 0) {
    unit = mealFoodItem.quantity;
  } else {
    unit = mealFoodItem.grams / foodItem.weight;
  }
  mealFoodItem.update({
    calories: unit * foodItem.calories,
    carbs: unit * foodItem.carbohydrates,
    protein: unit * foodItem.protein,
    fat: unit * foodItem.fat,
  });
};
