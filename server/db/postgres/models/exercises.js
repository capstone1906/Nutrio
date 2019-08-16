const Sequelize = require('sequelize');
const db = require('../db');

const Exercises = db.define('exercises', {
  met: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  activity: {
    type: Sequelize.STRING,
    allowNull: false,
    // validate: {
    //   notEmpty: true,
    // },
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    // validate: {
    //   notEmpty: true,
    // },
  },
});

module.exports = Exercises;
