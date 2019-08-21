const CheckIns = require('./checkIns');
const DailyGoals = require('./dailyGoals');
const Exercises = require('./exercises');
const FavoriteMeals = require('./favoriteMeals');
const FoodItems = require('./foodItems');
const LongTermGoals = require('./longTermGoals');
const MealFoodItems = require('./mealFoodItems');
const Meals = require('./meals');
const Users = require('./users');
const UserMeals = require('./userMeals');
const UserFoods = require('./userFoods');
const FavoriteFoods = require('./favoriteFoods');

LongTermGoals.belongsTo(Users);
Users.hasOne(LongTermGoals);

DailyGoals.belongsTo(Users);
Users.hasOne(DailyGoals);

CheckIns.belongsTo(Users);
Users.hasMany(CheckIns);

FoodItems.belongsToMany(Meals, { through: MealFoodItems });
Meals.belongsToMany(FoodItems, { through: MealFoodItems });

FoodItems.belongsToMany(Users, { through: UserFoods });
Users.belongsToMany(FoodItems, { through: UserFoods });

FoodItems.belongsToMany(Users, { through: FavoriteFoods });
Users.belongsToMany(FoodItems, { through: FavoriteFoods });

/////////
Meals.belongsToMany(Users, {
  as: 'FavoritedByUser',
  through: 'favoriteMeals',
});

Users.belongsToMany(Meals, {
  as: 'bookmarkedMeals',
  through: 'favoriteMeals',
});

Meals.belongsToMany(Users, {
  as: 'AddedByUser',
  through: 'userMeals',
});

Users.belongsToMany(Meals, {
  as: 'previousMeals',
  through: 'userMeals',
});

module.exports = {
  CheckIns,
  DailyGoals,
  Exercises,
  FavoriteMeals,
  FoodItems,
  LongTermGoals,
  MealFoodItems,
  Meals,
  Users,
  UserMeals,
  FavoriteFoods,
};
