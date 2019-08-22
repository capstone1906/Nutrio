const Sequelize = require("sequelize");
const db = require("../db");

const Checkins = db.define("checkins", {
  caloriesBurned: {
    type: Sequelize.INTEGER,
    defaultValue: 0

  },
  caloriesConsumed: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0

    // validate: {
    //   notEmpty: true,
    // },
  },
  weight: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
    // validate: {
    //   notEmpty: true,
    // },
  }
},
{hooks: {
  beforeUpdate: function(checkIn, options) {
    if (checkIn.caloriesConsumed === null) {
      checkIn.caloriesConsumed = 0;
    }
    if (checkIn.weight === null) {
      checkIn.weight = 0;
    }
    if (checkIn.caloriesBurned === null) {
      checkIn.caloriesBurned = 0;
    }
  }
}});


module.exports = Checkins;
