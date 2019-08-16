const Sequelize = require('sequelize');
const db = require('../db');

const FavoriteMeals = db.define('favoriteMeals', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

module.exports = FavoriteMeals;
