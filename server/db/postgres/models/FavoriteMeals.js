const Sequelize = require('sequelize');
const db = require('../db');

const FavoriteMeals = db.define('favoriteMeals', {});

module.exports = FavoriteMeals;
