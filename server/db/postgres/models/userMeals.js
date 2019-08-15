const Sequelize = require('sequelize');
const db = require('../db');
const createUserMeal = require('../../neo4j/models/userMeals');

const UserMeals = db.define('userMeals', {
  rating: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

module.exports = UserMeals;

UserMeals.afterSave(async userMeal => {
  const newUserMeal = await createUserMeal(userMeal);
  return newUserMeal;
});
