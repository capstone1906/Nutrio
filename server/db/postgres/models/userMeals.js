const Sequelize = require('sequelize');
const db = require('../db');
const createUserMeal = require('../../neo4j/models/userMeals');

const UserMeals = db.define('userMeals', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  timesEaten: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
});

module.exports = UserMeals;

UserMeals.afterSave(async userMeal => {
  const newUserMeal = await createUserMeal(userMeal);
  return newUserMeal;
});
