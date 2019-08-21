const Sequelize = require('sequelize');
const db = require('../db');
const createFavoriteMeal = require('../../neo4j/models/favoriteMeals');

const FavoriteMeals = db.define('favoriteMeals', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = FavoriteMeals;


FavoriteMeals.afterSave(async favoriteMeal => {
  await createFavoriteMeal(favoriteMeal);
});
