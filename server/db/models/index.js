const FoodItems = require('./FoodItems');
const LongTermGoals = require('./LongTermGoals');
const DailyGoal = require('./DailyGoal')
const FavoriteMeals = require('./FavoriteMeals')
const User = require('./User');
const MealFoodItems = require('./MealFoodItems');
const Meals = require('./Meals');




LongTermGoals.belongsTo(User);
DailyGoal.belongsTo(User)
User.hasOne(DailyGoal)


FoodItems.belongsToMany(Meals, { through: MealFoodItems });
Meals.belongsToMany(FoodItems, { through: MealFoodItems });

Meals.belongsToMany(User, {through: FavoriteMeals})
User.hasMany(Meal, {through: FavoriteMeals})

module.exports = {
  FoodItems,
  LongTermGoals,
  DailyGoal,
  FavoriteMeals,
  User,
};
