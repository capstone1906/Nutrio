// const Sequelize = require('sequelize');

async function totalCalculator(props) {
  const MealFoodItems = require('./mealFoodItems');
  let calories = 0;
  let fat = 0;
  let protein = 0;
  let carbs = 0;
  await MealFoodItems.findAll({
    where: {
      mealId: props.mealId,
    },
  }).map(foodItem => {
    let unit = 1;
    if (foodItem.quantity > 0) {
      unit = foodItem.quantity;
    } else if (foodItem.grams > 0) {
      unit = foodItem.grams / foodItem.weight;
    }
    calories += foodItem.calories * unit;
    fat += foodItem.fat * unit;
    protein += foodItem.protein * unit;
    carbs += foodItem.carbs * unit;
  });
  const totalObject = {
    calories,
    protein,
    fat,
    carbs,
  };
  return totalObject;
}

module.exports = totalCalculator;
