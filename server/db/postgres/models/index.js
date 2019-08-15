const Checkins = require('./checkins');
const DailyGoals = require('./dailyGoals');
const Exercises = require('./exercises');
const FavoriteMeals = require('./favoriteMeals');
const FoodItems = require('./foodItems');
const LongTermGoals = require('./longTermGoals');
const mealFoodItems = require('./mealFoodItems');
const Users = require('./users');

LongTermGoals.belongsTo(Users);

module.exports = {
  Checkins,
  DailyGoals,
  Exercises,
  FavoriteMeals,
  FoodItems,
  LongTermGoals,
  mealFoodItems,
  Users,
};
