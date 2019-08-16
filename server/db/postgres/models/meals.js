const Sequelize = require('sequelize');
const db = require('../db');
const createMeal = require('../../neo4j/models/meals');

const Meals = db.define('meals', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '', //decide later
  },
  averageRating: {
    type: Sequelize.FLOAT,
    allowNull: false,
    validate: {
      min: 0.1,
      max: 5.0,
    },
  },
  totalCalories: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  totalCarbs: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  totalFat: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  totalProtein: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dominantMacro: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  entreeType: {
    type: Sequelize.ENUM(
      'Breakfast',
      'Lunch',
      'Dinner',
      'Snacks',
    ),
  }
});

Meals.afterSave(async meal => {
  const newMeal = await createMeal(meal);
  return newMeal;
});

module.exports = Meals;
