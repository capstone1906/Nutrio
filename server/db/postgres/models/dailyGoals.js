const Sequelize = require('sequelize');
const db = require('../db');

const DailyGoals = db.define('dailyGoals', {
  calorieLimit: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  caloriesToBurn: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  carbLimit: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  proteinLimit: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  fatLimit: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = DailyGoals;
