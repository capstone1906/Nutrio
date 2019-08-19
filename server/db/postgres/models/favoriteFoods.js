const Sequelize = require('sequelize');
const db = require('../db');

const FavoriteFoods = db.define('favoriteFoods', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = FavoriteFoods;
