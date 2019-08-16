const Sequelize = require('sequelize');
const db = require('../db');
const createUserMeal = require('../../neo4j/models/userMeals');

const UserMeals = db.define('userMeals', {
<<<<<<< HEAD
=======
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
>>>>>>> c46fcc1e465daf17379a5d4ba8711372de1b0435
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
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
