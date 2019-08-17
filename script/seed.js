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
      met: 4.0,
      activity: 'Bicycling',
      description: '<10 mph, general leisure',
    }),
    Exercises.create({
      met: 6.0,
      activity: 'Bicycling',
      description: '10-11.9 mph, leisure, slow, light effort',
    }),
    Exercises.create({
      met: 8.0,
      activity: 'Bicycling',
      description: '12-13.9 mph, leisure, moderate effort',
    }),
    Exercises.create({
      met: 10.0,
      activity: 'Bicycling',
      description: '14-15.9 mph, racing, fast, vigorous effort',
    }),
    Exercises.create({
      met: 12.0,
      activity: 'Bicycling',
      description:
        '16-19 mph, racing/not drafing or > 19 mph drafting, very fast',
    }),
    Exercises.create({
      met: 16.0,
      activity: 'Bicycling',
      description: '>20 mph, racing, not drafting',
    }),
    Exercises.create({
      met: 3.0,
      activity: 'Cycling (stationary)',
      description: '50 watts, very light effort',
    }),
    Exercises.create({
      met: 5.5,
      activity: 'Cycling (stationary)',
      description: '100 watts, light effort',
    }),
    Exercises.create({
      met: 7.0,
      activity: 'Cycling (stationary)',
      description: '150 watts, moderate effort',
    }),
    Exercises.create({
      met: 10.5,
      activity: 'Cycling (stationary)',
      description: '200 watts, vigorous effort',
    }),
    Exercises.create({
      met: 12.5,
      activity: 'Cycling (stationary)',
      description: '250 watts, very vigorous effort',
    }),
    Exercises.create({
      met: 4.5,
      activity: 'Calisthenics',
      description: 'home exercise, light or moderate effort',
    }),
    Exercises.create({
      met: 8.0,
      activity: 'Calisthenics',
      description: 'vigorous effort (pushups, pullups, situps)',
    }),
    Exercises.create({
      met: 5.0,
      activity: 'Dancing',
      description: 'low impact, aerobic',
    }),
    Exercises.create({
      met: 6.0,
      activity: 'Dancing',
      description: 'aerobic, ballet or modern',
    }),
    Exercises.create({
      met: 7.0,
      activity: 'Dancing',
      description: 'high impact aerobic',
    }),
    Exercises.create({
      met: 8.0,
      activity: 'Running',
      description: '5 mph (12 min mile)',
    }),
    Exercises.create({
      met: 9.0,
      activity: 'Running',
      description: '5.2 mph (11.5 min mile)',
    }),
    Exercises.create({
      met: 10.0,
      activity: 'Running',
      description: '6.0 mph (10 min mile)',
    }),
    Exercises.create({
      met: 11.0,
      activity: 'Running',
      description: '6.7 mph, (9 min mile)',
    }),
    Exercises.create({
      met: 11.5,
      activity: 'Running',
      description: '7 mph, (8.5 min mile)',
    }),
    Exercises.create({
      met: 12.5,
      activity: 'Running',
      description: '7.5 mph, (8 min mile)',
    }),
    Exercises.create({
      met: 13.5,
      activity: 'Running',
      description: '8 mph, (7.5 min mile)',
    }),
    Exercises.create({
      met: 14.0,
      activity: 'Running',
      description: '8.6 mph, (7 min mile)',
    }),
    Exercises.create({
      met: 15.0,
      activity: 'Running',
      description: '9 mph, (6.5 min mile)',
    }),
    Exercises.create({
      met: 16.0,
      activity: 'Running',
      description: '10 mph, (6 min mile)',
    }),
    Exercises.create({
      met: 18.0,
      activity: 'Running',
      description: '10.9 mph, (5.5 min mile)',
    }),
    Exercises.create({
      met: 15.0,
      activity: 'Running',
      description: 'Running stairs',
    }),
    Exercises.create({
      met: 8.5,
      activity: 'Rowing machine',
      description: '150 watts, vigorous effort',
    }),
    Exercises.create({
      met: 12.0,
      activity: 'Rowing machine',
      description: '200 watts, very vigorous effort',
    }),
    Exercises.create({
      met: 7.0,
      activity: 'Skiing, cross country',
      description: '2.5 mph, slow or light effort, ski walking',
    }),
    Exercises.create({
      met: 8.0,
      activity: 'Skiing, cross country',
      description: '4.0-4.9 mph, moderate speed and effort',
    }),
    Exercises.create({
      met: 9.0,
      activity: 'Skiing, cross country',
      description: '5.0-7.9 mph, brisk speed, vigorous effort',
    }),
    Exercises.create({
      met: 14.0,
      activity: 'Skiing, cross country',
      description: '>8 mph, racing',
    }),
    Exercises.create({
      met: 16.5,
      activity: 'Skiing, cross country',
      description: 'hard snow, uphill, maximum',
    }),
    Exercises.create({
      met: 5.0,
      activity: 'Skiing, downhill',
      description: 'light effort',
    }),
    Exercises.create({
      met: 6.0,
      activity: 'Skiing, downhill',
      description: 'moderate effort',
    }),
    Exercises.create({
      met: 8.0,
      activity: 'Skiing, downhill',
      description: 'vigorous effort, racing',
    }),
    Exercises.create({
      met: 4.4,
      activity: 'Stairmaster 4400 PT',
      description: 'manual program, level 2',
    }),
    Exercises.create({
      met: 6.5,
      activity: 'Stairmaster 4400 PT',
      description: 'manual program, level 4',
    }),
    Exercises.create({
      met: 8.6,
      activity: 'Stairmaster 4400 PT',
      description: 'manual program, level 6',
    }),
    Exercises.create({
      met: 10.7,
      activity: 'Stairmaster 4400 PT',
      description: 'manual program, level 8',
    }),
    Exercises.create({
      met: 12.7,
      activity: 'Stairmaster 4400 PT',
      description: 'manual program, level 10',
    }),
    Exercises.create({
      met: 14.8,
      activity: 'Stairmaster 4400 PT',
      description: 'manual program, level 12',
    }),
    Exercises.create({
      met: 16.9,
      activity: 'Stairmaster 4400 PT',
      description: 'manual program, level 14',
    }),
    Exercises.create({
      met: 5.0,
      activity: 'Stairmaster Stepmill 7000 PT',
      description: 'exercise stage 2',
    }),
    Exercises.create({
      met: 7.0,
      activity: 'Stairmaster Stepmill 7000 PT',
      description: 'exercise stage 4',
    }),
    Exercises.create({
      met: 9.0,
      activity: 'Stairmaster Stepmill 7000 PT',
      description: 'exercise stage 6',
    }),
    Exercises.create({
      met: 11.0,
      activity: 'Stairmaster Stepmill 7000 PT',
      description: 'exercise stage 8',
    }),
    Exercises.create({
      met: 13.0,
      activity: 'Stairmaster Stepmill 7000 PT',
      description: 'exercise stage 10',
    }),
    Exercises.create({
      met: 15.0,
      activity: 'Stairmaster Stepmill 7000 PT',
      description: 'exercise stage 12',
    }),
    Exercises.create({
      met: 17.0,
      activity: 'Stairmaster Stepmill 7000 PT',
      description: 'exercise stage 14',
    }),
    Exercises.create({
      met: 6.0,
      activity: 'Swimming',
      description: 'leisurely, not lap swimming',
    }),
    Exercises.create({
      met: 8.0,
      activity: 'Swimming',
      description: 'backstroke, general',
    }),
    Exercises.create({
      met: 10.0,
      activity: 'Swimming',
      description: 'breaststroke, general',
    }),
    Exercises.create({
      met: 11.0,
      activity: 'Swimming',
      description: 'butterfly, general',
    }),
    Exercises.create({
      met: 2.5,
      activity: 'Walking',
      description: '2 mph, level, slow pace, firm surface',
    }),
    Exercises.create({
      met: 3.0,
      activity: 'Walking',
      description: '2.5 mph, firm surface',
    }),
    Exercises.create({
      met: 3.5,
      activity: 'Walking',
      description: '3 mph, level, moderate pace, firm surface',
    }),
    Exercises.create({
      met: 4.0,
      activity: 'Walking',
      description: '3.5-4 mph, level, brisk, firm surface',
    }),
    Exercises.create({
      met: 4.5,
      activity: 'Walking',
      description: '4.5 mph, level, firm surface, very very brisk',
    }),
    Exercises.create({
      met: 6.5,
      activity: 'Walking',
      description: 'racewalking',
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
    name: 'Great Dish 6',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Protein',
    entreeType: 'Breakfast',
  };

  var meal7 = {
    name: 'Great Dish 7',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Protein',
    entreeType: 'Lunch',
  };

  var meal8 = {
    name: 'Great Dish 8',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Protein',
    entreeType: 'Dinner',
  };

  var meal9 = {
    name: 'Great Dish 9',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Protein',
    entreeType: 'Snacks',
  };

  var meal10 = {
    name: 'Great Dish 10',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Fat',
    entreeType: 'Breakfast',
  };

  var meal11 = {
    name: 'Great Dish 11',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Fat',
    entreeType: 'Breakfast',
  };

  var meal12 = {
    name: 'Great Dish 12',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Fat',
    entreeType: 'Lunch',
  };

  var meal13 = {
    name: 'Great Dish 13',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Fat',
    entreeType: 'Dinner',
  };

  var meal14 = {
    name: 'Great Dish 14',
    averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
    totalCalories: Math.floor(Math.random() * 1000),
    totalCarbs: Math.floor(Math.random() * 30),
    totalProtein: Math.floor(Math.random() * 10),
    totalFat: Math.floor(Math.random() * 10),
    dominantMacro: 'Fat',
    entreeType: 'Snacks',
  };

  var meal15 = {
    name: 'Great Dish 15',
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
      userId: 1 + Math.floor(Math.random() * 2),
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
