'use strict';

const db = require('../server/db');
const {
  User,
  FoodItem,
  CheckIn,
  LongTermGoal,
  Excercises,
  Meals,
} = require('../server/db/models');

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  const users = await Promise.all([
    User.create({
      email: 'cody@email.com',
      password: '123',
      height: 72,
      weight: 185,
      age: 25,
      activityLevel: 1.375,
      bodyType: 'ectomorph',
    }),
    User.create({
      email: 'murphy@email.com',
      password: '123',
      height: 68,
      weight: 165,
      age: 22,
      activityLevel: 1.375,
      bodyType: 'mesomorph',
    }),
  ]);

  for (let i = 1; i < 31; i++) {
    var day = i;
    if (i < 10) {
      day = '0' + i;
    }
    var yesterday = `07-${day}-2019`;
    var ranDay = new Date(yesterday);

    await CheckIn.create({
      weight: 200 - i / 4,
      caloriesBurned: Math.floor(500 - Math.random() * 100),
      caloriesConsumed: Math.floor(1500 - Math.random() * 100),
      userId: 1,
    });
  }
  var yesterday = `07-31-2019`;
  var ranDay = new Date(yesterday);
  // testing
  await LongTermGoal.create({
    startingWeight: 200,
    endingWeight: 180,
    startDate: yesterday,
    endDate: '10-31-2019',
    userId: 1,
    statedGoal: 'Lose 1 lb a week',
  });

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
      FoodItem.create(food1),
      FoodItem.create(food2),
      FoodItem.create(food3),
      FoodItem.create(food4),
    ]);

    await Promise.all([
      Excercises.create({
        mets: 6.0,
        activity: 'Bicycling',
        description: '10-11.9 mph, leisure, slow, light effort',
      }),
      Excercises.create({
        mets: 10.0,
        activity: 'Bicycling',
        description: '14-15.9 mph, racing, fast, vigorous effort',
      }),
      Excercises.create({
        mets: 7.0,
        activity: 'Cycling (stationary)',
        description: '150 watts, moderate effort',
      }),
      Excercises.create({
        mets: 8.0,
        activity: 'Running',
        description: '5 mph (12 min mile)',
      }),
    ]);

    await Promise.all([
      Meals.create({
        name: 'Great Dish',
        averageRating: Math.floor(Math.random() * Math.floor(5)),
        totalCarbohydrate: Math.floor(Math.random() * 30),
        totalProtein: Math.floor(Math.random() * 10),
        totalFat: Math.floor(Math.random() * 10),
        dominantMacro: 'carbohydrate',
        entreeType: 'lunch',
      }),
    ]);
  }

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
