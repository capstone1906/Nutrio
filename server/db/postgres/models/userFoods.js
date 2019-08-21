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

UserFoods.beforeValidate(async userFood => {
  const prevFood = await UserFoods.findOne({
    where: { userId: userFood.userId, foodItemId: userFood.foodItemId },
  });
  if (prevFood) {
    userFood.timesEaten += prevFood.timesEaten;
    await prevFood.destroy();
  }
});

UserFoods.afterSave(async userFood => {
  const newUserFood = await createUserFood(userFood);
  return newUserFood;
});
