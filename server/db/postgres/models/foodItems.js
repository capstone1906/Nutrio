const Sequelize = require('sequelize');
const db = require('../db');

const FoodItems = db.define('foodItems', {
  name: {
    type: Sequelize.STRING,
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
});

module.exports = FoodItems;
