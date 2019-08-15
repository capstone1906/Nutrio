const Sequelize = require("sequelize");
const db = require("../db");

const Dailygoal = db.define("dailyGoal", {
  calorieLimit: {
    type: Sequelize.INTEGER
  },
  caloriesToBurn: {
    type: Sequelize.INTEGER
  },
  carbLimit: {
    type: Sequelize.INTEGER
  },
  proteinLimit: {
    type: Sequelize.INTEGER
  },
  fatLimit: {
    type: Sequelize.INTEGER
  },

});

module.exports = Dailygoal;
