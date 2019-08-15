const Sequelize = require('sequelize');
const db = require('../db/postgres/index');

const Meals = db.define('meals', {
  name: {
    type: Sequelize.STRING,
    defaultValue: '', //decide later
  },
  averageRating: {
    type: Sequelize.FLOAT,
    validate: {
      min: 0.1,
      max: 5.0,
    },
  },
  totalCalories: Sequelize.INTEGER,
  totalCarbs: Sequelize.INTEGER,
  totalFat: Sequelize.INTEGER,
  totalProtein: Sequelize.INTEGER,
  dominantMacro: Sequelize.STRING,
});

module.exports = Meals;
