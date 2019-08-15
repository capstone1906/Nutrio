const Sequelize = require('sequelize');
const db = require('../db');

const Meals = db.define('meals', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '', //decide later
  },
  averageRating: {
    type: Sequelize.FLOAT,
    allowNull: false,
    validate: {
      min: 0.1,
      max: 5.0,
    },
  },
  totalCalories: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  totalCarbs: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  totalFat: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  totalProtein: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dominantMacro: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Meals;
