const Sequelize = require('sequelize');
const db = require('../db');
const createMealFoodItems = require('../../neo4j/models/mealFoodItems');

const MealFoodItems = db.define('mealFoodItems', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  calories: {
    type: Sequelize.INTEGER,
    // allowNull: false,
    // validate: {
    //   notEmpty: true,
    // },
  },
  quantity: {
    type: Sequelize.INTEGER,
    // allowNull: false,
    // validate: {
    //   notEmpty: true,
    // },
  },
});

module.exports = MealFoodItems;

MealFoodItems.afterSave(async mealFoodItem => {
  const newMealItem = await createMealFoodItems(mealFoodItem);
  return newMealItem;
});
