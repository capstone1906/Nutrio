const Sequelize = require('sequelize');
const db = require('./database');

const Checkins = db.define('Checkins', {
  caloriesBurned: {
    type: Sequelize.INTEGER
  },
  caloriesConsumed: {
    type: Sequelize.INTEGER,
    // allowNull: false,
    // validate: {
    //   notEmpty: true,
    // },
  },
  weight: {
    type: Sequelize.INTEGER,
    // allowNull: false,
    // validate: {
    //   notEmpty: true,
    // },
  },
});

module.exports = Checkins;
