const Sequelize = require('sequelize');
const db = require('../db');

<<<<<<< HEAD
const FavoriteMeals = db.define('favoriteMeals', {});
=======
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
>>>>>>> c46fcc1e465daf17379a5d4ba8711372de1b0435

module.exports = FavoriteMeals;
