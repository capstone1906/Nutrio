const Sequelize = require('sequelize');
const db = require('../db');

const DailyGoals = db.define('dailyGoals', {
  calorieLimit: {
    type: Sequelize.INTEGER,
  },
  caloriesToBurn: {
    type: Sequelize.INTEGER,
  },
  carbLimit: {
    type: Sequelize.INTEGER,
  },
  proteinLimit: {
    type: Sequelize.INTEGER,
  },
  fatLimit: {
    type: Sequelize.INTEGER,
  },
});

module.exports = DailyGoals;
