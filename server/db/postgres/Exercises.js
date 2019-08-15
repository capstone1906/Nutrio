const Sequelize = require('sequelize');
const db = require('./database');

const Exercises = db.define('Exercises', {
  met: {
    type: Sequelize.INTEGER
  },
  activity: {
    type: Sequelize.STRING,
    // allowNull: false,
    // validate: {
    //   notEmpty: true,
    // },
  },
  description: {
    type: Sequelize.STRING,
    // allowNull: false,
    // validate: {
    //   notEmpty: true,
    // },
  },
});

module.exports = Exercises;
