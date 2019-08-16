/* eslint-disable max-statements */
'use strict';
const { green, red } = require('chalk');
const db = require('../server/db/postgres/db');

const {
  CheckIns,
  DailyGoals,
  Exercises,
  FoodItems,
  FavoriteMeals,
  LongTermGoals,
  Meals,
  MealFoodItems,
  UserMeals,
  Users,
} = require('../server/db/postgres/models');

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  var user1 = {
    email: 'cody@email.com',
    password: '123',
    height: 72,
    weight: 185,
    age: 25,
    activityLevel: 1.375,
    bodyType: 'Ectomorph',
  };

  var user2 = {
    email: 'murphy@email.com',
    password: '123',
    height: 68,
    weight: 165,
    age: 22,
    activityLevel: 1.375,
    bodyType: 'Mesomorph',
  };

  // Create users
  await Promise.all([Users.create(user1), Users.create(user2)]);

  // Create checkIns
  for (let i = 1; i < 31; i++) {
    await CheckIns.create({
      weight: 200 - i / 4,
      caloriesBurned: Math.floor(500 - Math.random() * 100),
      caloriesConsumed: Math.floor(1500 - Math.random() * 100),
      userId: 1,
    });
  }

  // Create daily goal
  await DailyGoals.create({
    calorieLimit: 2000,
    caloriesToBurn: 200,
    carbLimit: 50,
    proteinLimit: 30,
    fatLimit: 10,
    userId: 1,
  });

  await DailyGoals.create({
    calorieLimit: 3000,
    caloriesToBurn: 500,
    carbLimit: 50,
    proteinLimit: 30,
    fatLimit: 10,
    userId: 2,
  });

  // Create Exercises
  await Promise.all([
    Exercises.create({
      met: 6.0,
      activity: 'Bicycling',
      description: '10-11.9 mph, leisure, slow, light effort',
    }),
    Exercises.create({
      met: 10.0,
      activity: 'Bicycling',
      description: '14-15.9 mph, racing, fast, vigorous effort',
    }),
    Exercises.create({
      met: 7.0,
      activity: 'Cycling (stationary)',
      description: '150 watts, moderate effort',
    }),
    Exercises.create({
      met: 8.0,
      activity: 'Running',
      description: '5 mph (12 min mile)',
    }),
  ]);

  // Create food items
  var food1 = {
    name: 'Chicken',
    calories: Math.floor(500 + Math.random() * 3),
    fat: 5,
    carbohydrates: 0,
    protein: 35,
    dominantMacro: 'Protein',
  };
  var food2 = {
    name: 'Rice',
    calories: Math.floor(500 + Math.random() * 3),
    fat: 5,
    carbohydrates: 50,
    protein: 5,
    dominantMacro: 'Carbohydrate',
  };
  var food3 = {
    name: 'Broccoli',
    calories: Math.floor(300 - Math.random() * 3),
    fat: 1,
    carbohydrates: 10,
    protein: 1,
    dominantMacro: 'Carbohydrate',
  };
  var food4 = {
    name: 'Protein Shake',
    calories: Math.floor(700 - Math.random() * 3),
    fat: 5,
    carbohydrates: 10,
    protein: 70,
    dominantMacro: 'Protein',
  };

  await Promise.all([
    FoodItems.create(food1),
    FoodItems.create(food2),
    FoodItems.create(food3),
    FoodItems.create(food4),
  ]);

  var meal1 = {
    name: 'Great Dish 1',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Carbohydrate',
    entreeType: 'Breakfast',
  };

  var meal2 = {
    name: 'Great Dish 2',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Carbohydrate',
    entreeType: 'Lunch',
  };

  var meal3 = {
    name: 'Great Dish 3',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Carbohydrate',
    entreeType: 'Dinner',
  };

  var meal4 = {
    name: 'Great Dish 4',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Carbohydrate',
    entreeType: 'Snacks',
  };

  var meal5 = {
    name: 'Great Dish 5',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Carbohydrate',
    entreeType: 'Breakfast',
  };

  var meal6 = {
    name: 'Great Dish 1',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Protein',
    entreeType: 'Breakfast',
  };

  var meal7 = {
    name: 'Great Dish 2',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Protein',
    entreeType: 'Lunch',
  };

  var meal8 = {
    name: 'Great Dish 3',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Protein',
    entreeType: 'Dinner',
  };

  var meal9 = {
    name: 'Great Dish 4',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Protein',
    entreeType: 'Snacks',
  };

  var meal10 = {
    name: 'Great Dish 5',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Fat',
    entreeType: 'Breakfast',
  };

  var meal11 = {
    name: 'Great Dish 1',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Fat',
    entreeType: 'Breakfast',
  };

  var meal12 = {
    name: 'Great Dish 2',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Fat',
    entreeType: 'Lunch',
  };

  var meal13 = {
    name: 'Great Dish 3',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Fat',
    entreeType: 'Dinner',
  };

  var meal14 = {
    name: 'Great Dish 4',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Fat',
    entreeType: 'Snacks',
  };

  var meal15 = {
    name: 'Great Dish 5',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Fat',
    entreeType: 'Breakfast',
  };
  // Create meals
  await Promise.all([
    Meals.create(meal1),
    Meals.create(meal2),
    Meals.create(meal3),
    Meals.create(meal4),
    Meals.create(meal5),
    Meals.create(meal6),
    Meals.create(meal7),
    Meals.create(meal8),
    Meals.create(meal9),
    Meals.create(meal10),
    Meals.create(meal11),
    Meals.create(meal12),
    Meals.create(meal13),
    Meals.create(meal14),
    Meals.create(meal15),
  ]);

  var yesterday = `07-31-2019`;
  // var ranDay = new Date(yesterday);

  // Create longTermGoals
  for (let i = 1; i <= 2; i++) {
    await LongTermGoals.create({
      startWeight: 200,
      endingWeight: 180,
      startDate: yesterday,
      endDate: '10-31-2019',
      userId: i,
      statedGoal: 'Lose 1 lb a week',
    });
  }

  // Create mealFoodItems
  for (let i = 1; i <= 4; i++) {
    await MealFoodItems.create({
      calories: 200,
      quantity: 2,
      foodItemId: i,
      mealId: 1,
    });
  }

  for (let i = 1; i <= 15; i++) {
    await UserMeals.create({
      rating: 1 + Math.floor(Math.random() * 5),
      mealId: i,
      userId: 1,
    });
  }

  // Create Favorite meal
  for (let i = 1; i <= 5; i++) {
    await FavoriteMeals.create({
      rating: 1 + Math.floor(Math.random() * 5),
      mealId: i,
      userId: 1,
    });
  }

  console.log(green(`seeded successfully`));
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(red(err));
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}
