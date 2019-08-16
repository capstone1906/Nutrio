const Sequelize = require('sequelize');
const db = require('../db');
const createFood = require('../../neo4j/models/foodItems');

const FoodItems = db.define('foodItems', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  calories: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  carbohydrates: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  protein: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  fat: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dominantMacro: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = FoodItems;

FoodItems.afterSave(async food => {
  const newFood = await createFood(food);
  return newFood;
});
