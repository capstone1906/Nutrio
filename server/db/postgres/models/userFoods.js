const Sequelize = require('sequelize');
const db = require('../db');
const createUserFood = require('../../neo4j/models/userFoods');

const UserFoods = db.define('userFoods', {
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

module.exports = UserFoods;

UserFoods.afterSave(async userFood => {
  const newUserFood = await createUserFood(userFood);
  return newUserFood;
});
