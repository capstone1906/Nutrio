const Sequelize = require('sequelize');
const db = require('../db');
const createFood = require('../../neo4j/models/foodItems');

const FoodItems = db.define('foodItems', {
  food_name: {
    type: Sequelize.STRING,
    // unique: true,
  },
  calories: {
    type: Sequelize.FLOAT,
  },
  carbohydrates: {
    type: Sequelize.FLOAT,
  },
  protein: {
    type: Sequelize.FLOAT,
  },
  fat: {
    type: Sequelize.FLOAT,
  },
  dominantMacro: {
    type: Sequelize.STRING,
  },
  servingSize: {
    type: Sequelize.STRING
  },
  weight: {
    type: Sequelize.FLOAT
  },
  
});

module.exports = FoodItems;

FoodItems.afterSave(async food => {
  const newFood = await createFood(food);
  return newFood;
});
