const Sequelize = require('sequelize');
const db = require('../db');

const FoodItems = db.define('foodItems', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
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
