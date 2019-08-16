const Sequelize = require('sequelize');
const db = require('../db');

const LongTermGoals = db.define('longTermGoals', {
  startWeight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  endingWeight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  startDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  endDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  statedGoal: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = LongTermGoals;
