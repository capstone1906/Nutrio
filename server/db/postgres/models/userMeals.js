const Sequelize = require('sequelize');
const db = require('../db');

const UserMeals = db.define('favoriteMeals', {
  rating: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

module.exports = UserMeals;
