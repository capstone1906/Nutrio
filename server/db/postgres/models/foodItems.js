const Sequelize = require('sequelize');
const db = require('../db');
const createFood = require('../../neo4j/models/foodItems');

const FoodItems = db.define('foodItems', {
  food_name: {
    type: Sequelize.STRING,
    // unique: true,
  },
  calories: {
    type: Sequelize.INTEGER,
  },
  carbohydrates: {
    type: Sequelize.INTEGER,
  },
  protein: {
    type: Sequelize.INTEGER,
  },
  fat: {
    type: Sequelize.INTEGER,
  },
  dominantMacro: {
    type: Sequelize.STRING,
  },
  servingSize: {
    type: Sequelize.STRING,
  },
  weight: {
    type: Sequelize.INTEGER,
  },
});

module.exports = FoodItems;
FoodItems.beforeCreate(food => {
  if (food.fat > food.carbohydrates && food.fat > food.protein) {
    food.dominantMacro = 'fat';
  } else if (
    food.carbohydrates > food.fat &&
    food.carbohydrates > food.protein
  ) {
    food.dominantMacro = 'carbohydrates';
  } else {
    food.dominantMacro = 'protein';
  }
});

FoodItems.afterSave(async food => {
  const newFood = await createFood(food);
  return newFood;
});
