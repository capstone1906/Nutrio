const Sequelize = require('sequelize');
const db = require('./database');

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
