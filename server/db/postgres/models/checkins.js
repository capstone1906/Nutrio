const Sequelize = require('sequelize');
const db = require('../db');

const Checkins = db.define('checkins', {
  caloriesBurned: {
    type: Sequelize.INTEGER,
  },
  caloriesConsumed: {
    type: Sequelize.INTEGER,
    // allowNull: false,
    // validate: {
    //   notEmpty: true,
    // },
  },
  weight: {
    type: Sequelize.FLOAT,
    // allowNull: false,
    // validate: {
    //   notEmpty: true,
    // },
  },
});

module.exports = Checkins;
