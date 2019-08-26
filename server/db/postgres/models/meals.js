const Sequelize = require('sequelize');
const db = require('../db');
const {createMeal} = require('../../neo4j/models/meals');


const Meals = db.define('meals', {
  name: {
    type: Sequelize.STRING,
    defaultValue: '', //decide later
  },
  dominantMacro: {
    type: Sequelize.STRING,
  },
  entreeType: {
    type: Sequelize.ENUM('Breakfast', 'Lunch', 'Dinner', 'Snacks'),
  },
});



Meals.afterSave(async meal => {
  meal.calories = 0;
  meal.fat = 0;
  meal.protein = 0;
  meal.carbs = 0
  await createMeal(meal)
});

module.exports = Meals;
