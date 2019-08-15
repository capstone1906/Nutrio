const Sequelize = require('sequelize');
const db = require('../db');

const LongTermGoals = db.define('longTermGoals', {
  startWeight: {
    type: Sequelize.INTEGER,
  },
  endingWeight: {
    type: Sequelize.INTEGER,
  },
  startDate: {
    type: Sequelize.DATE,
  },
  endDate: {
    type: Sequelize.DATE,
  },
  statedGoal: {
    type: Sequelize.STRING,
  },
});

module.exports = LongTermGoals;
