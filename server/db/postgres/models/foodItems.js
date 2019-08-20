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
    type: Sequelize.STRING,
  },
  weight: {
<<<<<<< HEAD
    type: Sequelize.FLOAT
=======
    type: Sequelize.INTEGER,
>>>>>>> 05403c2aed7c9d6073da04a272687310702ca33a
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
