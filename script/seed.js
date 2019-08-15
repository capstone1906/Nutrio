'use strict';
const { green, red } = require('chalk');
const db = require('../server/db/postgres/db');
const {
  Users,
  FoodItems,
  CheckIns,
  LongTermGoals,
  Exercises,
  Meals,
} = require('../server/db/postgres/models');

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  // Create users
  const users = await Promise.all([
    Users.create({
      email: 'cody@email.com',
      password: '123',
      height: 72,
      weight: 185,
      age: 25,
      activityLevel: 1.375,
      bodyType: 'ectomorph',
    }),
    Users.create({
      email: 'murphy@email.com',
      password: '123',
      height: 68,
      weight: 165,
      age: 22,
      activityLevel: 1.375,
      bodyType: 'mesomorph',
    }),
  ]);

  // Create checkIns
  for (let i = 1; i < 31; i++) {
    var day = i;
    if (i < 10) {
      day = '0' + i;
    }
    var yesterday = `07-${day}-2019`;
    var ranDay = new Date(yesterday);

    await CheckIns.create({
      weight: 200 - i / 4,
      caloriesBurned: Math.floor(500 - Math.random() * 100),
      caloriesConsumed: Math.floor(1500 - Math.random() * 100),
      userId: 1,
    });
  }
  var yesterday = `07-31-2019`;
  var ranDay = new Date(yesterday);

  // Create longTermGoals
  await LongTermGoals.create({
    startWeight: 200,
    endingWeight: 180,
    startDate: yesterday,
    endDate: '10-31-2019',
    userId: 1,
    statedGoal: 'Lose 1 lb a week',
  });

  // Create food items
  for (var i = 1; i < 31; i++) {
    var day = i;
    if (i < 10) {
      day = '0' + i;
    }
    var yesterday = `07-${day}-2019`;
    var ranDay = new Date(yesterday);

    var food1 = {
      name: 'chicken',
      calories: Math.floor(500 + Math.random() * 3),
      fat: 5,
      carbohydrates: 0,
      protein: 35,
      dominantMacro: 'protein',
    };
    var food2 = {
      name: 'rice',
      calories: Math.floor(500 + Math.random() * 3),
      fat: 5,
      carbohydrates: 50,
      protein: 5,
      dominantMacro: 'carbohydrate',
    };
    var food3 = {
      name: 'broccoli',
      calories: Math.floor(300 - Math.random() * 3),
      fat: 1,
      carbohydrates: 10,
      protein: 1,
      dominantMacro: 'carbohydrate',
    };
    var food4 = {
      name: 'Protein Shake',
      calories: Math.floor(700 - Math.random() * 3),
      fat: 5,
      carbohydrates: 10,
      protein: 70,
      dominantMacro: 'protein',
    };

    await Promise.all([
      FoodItems.create(food1),
      FoodItems.create(food2),
      FoodItems.create(food3),
      FoodItems.create(food4),
    ]);
  }

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

  // Create meals
  await Promise.all([
    Meals.create({
      name: 'Great Dish',
      averageRating: Math.floor(Math.random() * Math.floor(5) + 1),
      totalCalories: Math.floor(Math.random() * 1000),
      totalCarbs: Math.floor(Math.random() * 30),
      totalProtein: Math.floor(Math.random() * 10),
      totalFat: Math.floor(Math.random() * 10),
      dominantMacro: 'carbohydrate',
      entreeType: 'lunch',
    }),
  ]);

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
