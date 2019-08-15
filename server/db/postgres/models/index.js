const Checkins = require('./checkins');
const DailyGoals = require('./dailyGoals');
const Exercises = require('./exercises');
const FavoriteMeals = require('./favoriteMeals');
const FoodItems = require('./foodItems');
const LongTermGoals = require('./longTermGoals');
const MealFoodItems = require('./mealFoodItems');
const Meals = require('./meals');
const Users = require('./users');
const UserMeals = require('./userMeals');

LongTermGoals.belongsTo(Users);
Users.hasOne(LongTermGoals);

DailyGoals.belongsTo(Users);
Users.hasOne(DailyGoals);

Checkins.belongsTo(Users);
Users.hasMany(Checkins);

FoodItems.belongsToMany(Meals, { through: MealFoodItems });
Meals.belongsToMany(FoodItems, { through: MealFoodItems });

Meals.belongsToMany(Users, { through: FavoriteMeals });
Users.hasMany(Meals, { through: FavoriteMeals });

Meals.belongsToMany(Users, { through: UserMeals });
Users.hasMany(Meals, { through: UserMeals });

module.exports = {
  Checkins,
  DailyGoals,
  Exercises,
  FavoriteMeals,
  FoodItems,
  LongTermGoals,
  MealFoodItems,
  Meals,
  Users,
  UserMeals,
};
