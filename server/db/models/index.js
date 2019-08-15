const FoodItems = require('./FoodItems');
const LongTermGoals = require('./LongTermGoals');
// const User = require('./User');
// const MealFoodItems = require('./MealFoodItems');
// const Meals = require('./Meals');

// LongTermGoals.belongsTo(User);

// FoodItems.belongsToMany(Meals, { through: MealFoodItems });
// Meals.belongsToMany(FoodItems, { through: MealFoodItems });

module.exports = {
  FoodItems,
  LongTermGoals,
  // User,
};
