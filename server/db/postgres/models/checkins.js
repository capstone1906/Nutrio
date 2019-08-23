const Sequelize = require("sequelize");
const db = require("../db");

const Checkins = db.define("checkins", {
  caloriesBurned: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  caloriesConsumed: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  weight: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Checkins;
