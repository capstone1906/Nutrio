const Sequelize = require('sequelize');
const db = require('../db');
const createFavoriteFood = require('../../neo4j/models/favoriteFoods');

const FavoriteFoods = db.define('favoriteFoods', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = FavoriteFoods;

FavoriteFoods.afterSave(async favoriteFood => {
  await createFavoriteFood(favoriteFood);
});
