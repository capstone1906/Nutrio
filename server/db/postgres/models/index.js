const User = require('./user');
const FoodItems = require('./FoodItems');
const LongTermGoals = require('./LongTermGoals');

LongTermGoals.belongsTo(User);

module.exports = {
  User,
  FoodItems,
  LongTermGoals,
};
