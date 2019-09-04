/* eslint-disable camelcase */
/* eslint-disable complexity */
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
  FavoriteFoods,
  LongTermGoals,
  Meals,
  MealFoodItems,
  UserMeals,
  Users,
} = require('../server/db/postgres/models');

const { resetDB } = require('../server/db/neo4j/db');

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');
  await resetDB();

  const user1 = {
    email: 'cody@email.com',
    firstName: 'Cody',
    password: '123',
    height: 72,
    weight: 185,
    age: 25,
    activityLevel: 1.375,
    bodyType: 'Ectomorph',
  };

  const user2 = {
    email: 'murphy@email.com',
    firstName: 'Murphy',
    password: '123',
    height: 56,
    weight: 85,
    age: 18,
    activityLevel: 1.375,
    bodyType: 'Endomorph',
    gender: 'male',
  };

  const user3 = {
    email: 'brad@email.com',
    firstName: 'Brad',
    password: '123',
    height: 80,
    weight: 270,
    age: 27,
    activityLevel: 1.5,
    bodyType: 'Ectomorph',
    gender: 'male',
  };

  const user4 = {
    email: 'emily@email.com',
    firstName: 'Emily',
    password: '123',
    height: 68,
    weight: 170,
    age: 22,
    activityLevel: 1.2,
    bodyType: 'Endomorph',
    gender: 'male',
  };

  const user5 = {
    email: 'tasha@email.com',
    firstName: 'Tasha',
    password: '123',
    height: 69,
    weight: 182,
    age: 32,
    activityLevel: 1.2,
    bodyType: 'Mesomorph',
    gender: 'male',
  };

  var user6 = {
    email: 'eddy@email.com',
    firstName: 'Eddy',
    password: '123',
    height: 72,
    weight: 205,
    age: 18,
    activityLevel: 1.375,
    bodyType: 'Endomorph',
    gender: 'male',
  };

  // Create users
  await Promise.all([
    Users.create(user1),
    Users.create(user2),
    Users.create(user3),
    Users.create(user4),
    Users.create(user5),
    Users.create(user6),
  ]);

  // Create checkIns
  for (let i = 50; i < 140; i++) {
    await CheckIns.create({
      weight: 205 - ((Math.floor(Math.random() * 5) + 10) / 100) * i,
      caloriesBurned: Math.floor(500 - Math.random() * 100),
      caloriesConsumed: Math.floor(1500 - Math.random() * 100),
      createdAt: new Date(2019, 7, -113 + i), // -113 creates through 8/26
      userId: 1,
    });
  }

  // Create daily goal
  await DailyGoals.create({
    calorieLimit: 2400,
    caloriesToBurn: 200,
    carbLimit: 200,
    proteinLimit: 200,
    fatLimit: 180,
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
  // Breakfast
  const food1 = {
    food_name: 'banana',
    calories: 105,
    fat: 1,
    carbohydrates: 27,
    protein: 2,
    servingSize: `medium (7" to 7-7/8" long)`,
    weight: 118,
  };
  const food2 = {
    food_name: 'cocoa puffs',
    calories: 138,
    fat: 2,
    carbohydrates: 30,
    protein: 2,
    servingSize: 'cup',
    weight: 36,
  };
  const food3 = {
    food_name: 'protein shake',
    calories: 171,
    fat: 9,
    carbohydrates: 3,
    protein: 20,
    servingSize: 'bottle',
    weight: 295,
  };
  const food4 = {
    food_name: 'egg',
    calories: 72,
    fat: 5,
    carbohydrates: 1,
    protein: 7,
    servingSize: 'large',
    weight: 50,
  };
  const food5 = {
    food_name: 'cottage cheese',
    calories: 214,
    fat: 10,
    carbohydrates: 8,
    protein: 24,
    servingSize: 'cup',
    weight: 218,
  };
  const food6 = {
    food_name: 'oatmeal',
    calories: 167,
    fat: 4,
    carbohydrates: 29,
    protein: 6,
    servingSize: 'cup',
    weight: 234,
  };
  const food7 = {
    food_name: 'bacon',
    calories: 54,
    fat: 5,
    carbohydrates: 1,
    protein: 4,
    servingSize: 'strip',
    weight: 12,
  };
  const food8 = {
    food_name: 'english muffin',
    calories: 134,
    fat: 1,
    carbohydrates: 27,
    protein: 5,
    servingSize: 'muffin',
    weight: 57,
  };
  const food9 = {
    food_name: 'breakfast sausage',
    calories: 75,
    fat: 7,
    carbohydrates: 1,
    protein: 5,
    servingSize: 'link',
    weight: 23,
  };
  const food10 = {
    food_name: 'toast',
    calories: 64,
    fat: 1,
    carbohydrates: 12,
    protein: 2,
    servingSize: 'slice',
    weight: 22,
  };
  const food11 = {
    food_name: 'pancake',
    calories: 91,
    fat: 4,
    carbohydrates: 11,
    protein: 3,
    servingSize: 'pancake',
    weight: 40,
  };
  const food12 = {
    food_name: 'cereal bar',
    calories: 127,
    fat: 0,
    carbohydrates: 29,
    protein: 2,
    servingSize: 'bar',
    weight: 37,
  };
  const food13 = {
    food_name: 'crepe',
    calories: 106,
    fat: 5,
    carbohydrates: 10,
    protein: 4,
    servingSize: '8-inch crepe',
    weight: 64,
  };
  const food14 = {
    food_name: 'croissant',
    calories: 272,
    fat: 14,
    carbohydrates: 31,
    protein: 5,
    servingSize: 'croissant, large',
    weight: 67,
  };
  const food15 = {
    food_name: 'french toast',
    calories: 219,
    fat: 11,
    carbohydrates: 23,
    protein: 7,
    servingSize: 'slice without syrup',
    weight: 84,
  };
  const food16 = {
    food_name: 'grits',
    calories: 151,
    fat: 1,
    carbohydrates: 32,
    protein: 3,
    servingSize: 'cup',
    weight: 233,
  };
  const food17 = {
    food_name: 'hash browns',
    calories: 144,
    fat: 9,
    carbohydrates: 15,
    protein: 1,
    servingSize: 'patty',
    weight: 53,
  };
  const food18 = {
    food_name: 'orange juice',
    calories: 112,
    fat: 1,
    carbohydrates: 26,
    protein: 2,
    servingSize: 'cup',
    weight: 248,
  };
  const food19 = {
    food_name: 'yogurt',
    calories: 107,
    fat: 3,
    carbohydrates: 12,
    protein: 9,
    servingSize: 'container (6 oz)',
    weight: 170,
  };
  const food20 = {
    food_name: 'waffle',
    calories: 218,
    fat: 2,
    carbohydrates: 25,
    protein: 6,
    servingSize: 'waffle, round (7" dia)',
    weight: 75,
  };

  // Lunch
  const food21 = {
    food_name: 'rice',
    calories: 205,
    fat: 1,
    carbohydrates: 45,
    protein: 5,
    servingSize: 'cup',
    weight: 158,
  };
  const food22 = {
    food_name: 'broccoli',
    calories: 13,
    fat: 1,
    carbohydrates: 3,
    protein: 1,
    servingSize: `spear (about 5" long)`,
    weight: 37,
  };
  const food23 = {
    food_name: 'chicken breast',
    calories: 198,
    fat: 5,
    carbohydrates: 0,
    protein: 38,
    servingSize: 'breast',
    weight: 120,
  };
  const food24 = {
    food_name: 'brussel sprouts',
    calories: 8,
    fat: 1,
    carbohydrates: 12,
    protein: 5,
    servingSize: 'sprout',
    weight: 168,
  };
  const food25 = {
    food_name: 'cheddar cheese',
    calories: 115,
    fat: 10,
    carbohydrates: 1,
    protein: 7,
    servingSize: 'oz',
    weight: 29,
  };
  const food26 = {
    food_name: 'tomato',
    calories: 23,
    fat: 1,
    carbohydrates: 5,
    protein: 1,
    servingSize: `medium whole (2.5" dia)`,
    weight: 123,
  };
  const food27 = {
    food_name: 'hamburger',
    calories: 540,
    fat: 27,
    carbohydrates: 41,
    protein: 35,
    servingSize: 'sandwich',
    weight: 226,
  };
  const food28 = {
    food_name: 'pickle',
    calories: 5,
    fat: 0,
    carbohydrates: 1,
    protein: 0,
    servingSize: 'spear',
    weight: 35,
  };
  const food29 = {
    food_name: 'hummus',
    calories: 400,
    fat: 24,
    carbohydrates: 36,
    protein: 20,
    servingSize: 'cup',
    weight: 240,
  };
  const food30 = {
    food_name: 'pita chips',
    calories: 130,
    fat: 4,
    carbohydrates: 20,
    protein: 4,
    servingSize: 'oz',
    weight: 29,
  };
  const food31 = {
    food_name: 'can of tuna',
    calories: 220,
    fat: 5,
    carbohydrates: 0,
    protein: 41,
    servingSize: 'can',
    weight: 172,
  };
  const food32 = {
    food_name: 'hot dog',
    calories: 155,
    fat: 6,
    carbohydrates: 1,
    protein: 6,
    servingSize: 'frankfurter',
    weight: 48,
  };
  const food33 = {
    food_name: 'sloppy joe',
    calories: 399,
    fat: 15,
    carbohydrates: 37,
    protein: 27,
    servingSize: 'sandwich',
    weight: 192,
  };
  const food34 = {
    food_name: 'taco',
    calories: 210,
    fat: 10,
    carbohydrates: 21,
    protein: 9,
    servingSize: 'taco',
    weight: 102,
  };
  const food35 = {
    food_name: 'grilled cheese',
    calories: 366,
    fat: 23,
    carbohydrates: 28,
    protein: 12,
    servingSize: 'sandwich',
    weight: 106,
  };
  const food36 = {
    food_name: 'minestrone',
    calories: 127,
    fat: 3,
    carbohydrates: 21,
    protein: 5,
    servingSize: 'cup',
    weight: 240,
  };
  const food37 = {
    food_name: 'chicken noodle soup',
    calories: 124,
    fat: 5,
    carbohydrates: 15,
    protein: 6,
    servingSize: 'bowl (2 cups)',
    weight: 496,
  };
  const food38 = {
    food_name: 'zucchini',
    calories: 33,
    fat: 1,
    carbohydrates: 6,
    protein: 3,
    servingSize: 'medium',
    weight: 217,
  };
  const food39 = {
    food_name: 'bread roll',
    calories: 77,
    fat: 2,
    carbohydrates: 13,
    protein: 3,
    servingSize: 'roll',
    weight: 28,
  };
  const food40 = {
    food_name: 'gyro',
    calories: 723,
    fat: 30,
    carbohydrates: 43,
    protein: 48,
    servingSize: 'sandwich',
    weight: 390,
  };
  const food41 = {
    food_name: 'caprese salad',
    calories: 220,
    fat: 5,
    carbohydrates: 5,
    protein: 13,
    servingSize: 'cup',
    weight: 161,
  };
  const food42 = {
    food_name: 'beef stew',
    calories: 535,
    fat: 16,
    carbohydrates: 41,
    protein: 58,
    servingSize: 'bowl',
    weight: 504,
  };

  // Dinner
  const food43 = {
    food_name: 'pasta',
    calories: 196,
    fat: 2,
    carbohydrates: 39,
    protein: 8,
    servingSize: 'cup',
    weight: 124,
  };
  const food44 = {
    food_name: 'sushi',
    calories: 349,
    fat: 19,
    carbohydrates: 38,
    protein: 8,
    servingSize: `roll (8 pieces)`,
    weight: 211,
  };
  const food45 = {
    food_name: 'meatloaf',
    calories: 330,
    fat: 19,
    carbohydrates: 14,
    protein: 27,
    servingSize: 'slice',
    weight: 183,
  };
  const food46 = {
    food_name: 'sweet potato',
    calories: 115,
    fat: 1,
    carbohydrates: 27,
    protein: 2,
    servingSize: 'medium',
    weight: 151,
  };
  const food47 = {
    food_name: 'steak',
    calories: 79,
    fat: 6,
    carbohydrates: 0,
    protein: 8,
    servingSize: 'oz',
    weight: 29,
  };
  const food48 = {
    food_name: 'pizza',
    calories: 285,
    fat: 11,
    carbohydrates: 36,
    protein: 13,
    servingSize: 'slice',
    weight: 108,
  };
  const food49 = {
    food_name: 'mozarella sticks',
    calories: 101,
    fat: 6,
    carbohydrates: 8,
    protein: 5,
    servingSize: 'piece',
    weight: 31,
  };
  const food50 = {
    food_name: 'onion rings',
    calories: 1004,
    fat: 54,
    carbohydrates: 115,
    protein: 14,
    servingSize: 'order',
    weight: 282,
  };
  const food51 = {
    food_name: 'breadsticks',
    calories: 25,
    fat: 1,
    carbohydrates: 4,
    protein: 1,
    servingSize: 'stick (9-1/4")',
    weight: 6,
  };
  const food52 = {
    food_name: 'lasagna',
    calories: 602,
    fat: 32,
    carbohydrates: 35,
    protein: 44,
    servingSize: 'serving (about 1.5 cups)',
    weight: 385,
  };
  const food53 = {
    food_name: 'stuffed pepper',
    calories: 236,
    fat: 12,
    carbohydrates: 17,
    protein: 16,
    servingSize: 'pepper',
    weight: 215,
  };
  const food54 = {
    food_name: 'salisbury steak',
    calories: 296,
    fat: 6,
    carbohydrates: 13,
    protein: 24,
    servingSize: 'serving',
    weight: 172,
  };
  const food55 = {
    food_name: 'baked potato',
    calories: 161,
    fat: 0,
    carbohydrates: 37,
    protein: 4,
    servingSize: 'potato medium',
    weight: 173,
  };
  const food56 = {
    food_name: 'asparagus',
    calories: 17,
    fat: 0,
    carbohydrates: 3,
    protein: 2,
    servingSize: 'spears',
    weight: 75,
  };
  const food57 = {
    food_name: 'curry',
    calories: 243,
    fat: 11,
    carbohydrates: 8,
    protein: 28,
    servingSize: 'cup',
    weight: 235,
  };
  const food58 = {
    food_name: 'octopus',
    calories: 139,
    fat: 0,
    carbohydrates: 4,
    protein: 25,
    servingSize: 'oz',
    weight: 85,
  };
  const food59 = {
    food_name: 'shrimp',
    calories: 6,
    fat: 0,
    carbohydrates: 0,
    protein: 1,
    servingSize: 'shrimp',
    weight: 5,
  };
  const food60 = {
    food_name: 'cheesecake',
    calories: 401,
    fat: 28,
    carbohydrates: 32,
    protein: 7,
    servingSize: 'piece (1 NLEa serving)',
    weight: 125,
  };
  const food61 = {
    food_name: 'italian beef',
    calories: 384,
    fat: 6,
    carbohydrates: 12,
    protein: 46,
    servingSize: 'cup',
    weight: 244,
  };
  const food62 = {
    food_name: 'garlic bread',
    calories: 150,
    fat: 2,
    carbohydrates: 18,
    protein: 4,
    servingSize: 'slice presliced',
    weight: 43,
  };
  const food63 = {
    food_name: 'hot fudge sundae',
    calories: 379,
    fat: 10,
    carbohydrates: 47,
    protein: 6,
    servingSize: 'sundae',
    weight: 165,
  };
  const food64 = {
    food_name: 'swordfish',
    calories: 182,
    fat: 8,
    carbohydrates: 0,
    protein: 15,
    servingSize: 'piece',
    weight: 106,
  };
  const food65 = {
    food_name: 'lamb',
    calories: 250,
    fat: 18,
    carbohydrates: 1,
    protein: 10,
    servingSize: 'oz',
    weight: 85,
  };
  const food66 = {
    food_name: 'crab',
    calories: 98,
    fat: 1,
    carbohydrates: 0,
    protein: 21,
    servingSize: 'cup, flaked and pieces',
    weight: 118,
  };

  // Snack
  const food67 = {
    food_name: 'apple',
    calories: 95,
    fat: 1,
    carbohydrates: 25,
    protein: 1,
    servingSize: `medium (3" dia)`,
    weight: 182,
  };
  const food68 = {
    food_name: 'ritz crackers',
    calories: 17,
    fat: 1,
    carbohydrates: 2,
    protein: 1,
    servingSize: 'cracker',
    weight: 4,
  };

  const food69 = {
    food_name: 'almond',
    calories: 8,
    fat: 1,
    carbohydrates: 1,
    protein: 1,
    servingSize: 'almond',
    weight: 2,
  };
  const food70 = {
    food_name: 'avocado',
    calories: 321,
    fat: 30,
    carbohydrates: 18,
    protein: 4,
    servingSize: 'medium',
    weight: 201,
  };
  const food71 = {
    food_name: 'blueberries',
    calories: 1,
    fat: 0,
    carbohydrates: 1,
    protein: 0,
    servingSize: 'berry',
    weight: 2,
  };
  const food72 = {
    food_name: 'granola bar',
    calories: 118,
    fat: 5,
    carbohydrates: 20,
    protein: 2,
    servingSize: 'bar',
    weight: 28,
  };
  const food73 = {
    food_name: 'cashews',
    calories: 162,
    fat: 14,
    carbohydrates: 10,
    protein: 5,
    servingSize: 'oz',
    weight: 28,
  };
  const food74 = {
    food_name: 'dried apricot',
    calories: 69,
    fat: 1,
    carbohydrates: 18,
    protein: 1,
    servingSize: 'oz',
    weight: 28,
  };
  const food75 = {
    food_name: 'beef stick',
    calories: 116,
    fat: 11,
    carbohydrates: 1,
    protein: 5,
    servingSize: 'stick',
    weight: 23,
  };
  const food76 = {
    food_name: 'strawberry',
    calories: 6,
    fat: 0,
    carbohydrates: 2,
    protein: 1,
    servingSize: 'large',
    weight: 18,
  };
  const food77 = {
    food_name: 'cherry',
    calories: 5,
    fat: 0,
    carbohydrates: 1,
    protein: 0,
    servingSize: 'cherry',
    weight: 8,
  };
  const food78 = {
    food_name: 'watermelon',
    calories: 86,
    fat: 0,
    carbohydrates: 22,
    protein: 2,
    servingSize: 'wedge (approx 1/16 of melon)',
    weight: 286,
  };
  const food79 = {
    food_name: 'plum',
    calories: 30,
    fat: 0,
    carbohydrates: 8,
    protein: 0,
    servingSize: 'fruit (2-1/8" dia)',
    weight: 66,
  };
  const food80 = {
    food_name: 'trail mix',
    calories: 353,
    fat: 23,
    carbohydrates: 33,
    protein: 10,
    servingSize: 'cup',
    weight: 73,
  };

  // food1 - food20 is breakfast
  // food21 - food42 is lunch
  // food43 - food66 is dinner
  // food67 - food 80 is snacks

  await Promise.all([
    FoodItems.create(food1),
    FoodItems.create(food2),
    FoodItems.create(food3),
    FoodItems.create(food4),
    FoodItems.create(food5),
    FoodItems.create(food6),
    FoodItems.create(food7),
    FoodItems.create(food8),
    FoodItems.create(food9),
    FoodItems.create(food10),
    FoodItems.create(food11),
    FoodItems.create(food12),
    FoodItems.create(food13),
    FoodItems.create(food14),
    FoodItems.create(food15),
    FoodItems.create(food16),
    FoodItems.create(food17),
    FoodItems.create(food18),
    FoodItems.create(food19),
    FoodItems.create(food20),
    FoodItems.create(food21),
    FoodItems.create(food22),
    FoodItems.create(food23),
    FoodItems.create(food24),
    FoodItems.create(food25),
    FoodItems.create(food26),
    FoodItems.create(food27),
    FoodItems.create(food28),
    FoodItems.create(food29),
    FoodItems.create(food30),
    FoodItems.create(food31),
    FoodItems.create(food32),
    FoodItems.create(food33),
    FoodItems.create(food34),
    FoodItems.create(food35),
    FoodItems.create(food36),
    FoodItems.create(food37),
    FoodItems.create(food38),
    FoodItems.create(food39),
    FoodItems.create(food40),
    FoodItems.create(food41),
    FoodItems.create(food42),
    FoodItems.create(food43),
    FoodItems.create(food44),
    FoodItems.create(food45),
    FoodItems.create(food46),
    FoodItems.create(food47),
    FoodItems.create(food48),
    FoodItems.create(food49),
    FoodItems.create(food50),
    FoodItems.create(food51),
    FoodItems.create(food52),
    FoodItems.create(food53),
    FoodItems.create(food54),
    FoodItems.create(food55),
    FoodItems.create(food56),
    FoodItems.create(food57),
    FoodItems.create(food58),
    FoodItems.create(food59),
    FoodItems.create(food60),
    FoodItems.create(food61),
    FoodItems.create(food62),
    FoodItems.create(food63),
    FoodItems.create(food64),
    FoodItems.create(food65),
    FoodItems.create(food66),
    FoodItems.create(food67),
    FoodItems.create(food68),
    FoodItems.create(food69),
    FoodItems.create(food70),
    FoodItems.create(food71),
    FoodItems.create(food72),
    FoodItems.create(food73),
    FoodItems.create(food74),
    FoodItems.create(food75),
    FoodItems.create(food76),
    FoodItems.create(food77),
    FoodItems.create(food78),
    FoodItems.create(food79),
    FoodItems.create(food80),
  ]);

  const userList = ['Cody', 'Murphy', 'Brad', 'Emily', 'Tasha', 'Eddy'];
  let counter = 0;

  //Breakfast
  const mealsBreakfast = [];
  for (let i = 0; i < 60; i++) {
    mealsBreakfast.push(
      Meals.create({
        name: `${userList[counter]}'s Breakfast`,
        entreeType: 'Breakfast',
      })
    );
    if (counter < 5) {
      counter++;
    } else {
      counter = 0;
    }
  }
  //Lunch
  const mealsLunch = [];
  for (let i = 0; i < 60; i++) {
    mealsLunch.push(
      Meals.create({
        name: `${userList[counter]}'s Lunch`,
        entreeType: 'Lunch',
      })
    );
    if (counter < 5) {
      counter++;
    } else {
      counter = 0;
    }
  }
  //Dinner
  const mealsDinner = [];
  for (let i = 0; i < 60; i++) {
    mealsDinner.push(
      Meals.create({
        name: `${userList[counter]}'s Dinner`,
        entreeType: 'Dinner',
      })
    );
    if (counter < 5) {
      counter++;
    } else {
      counter = 0;
    }
  }
  //Snack
  const mealsSnack = [];
  for (let i = 0; i < 60; i++) {
    mealsSnack.push(
      Meals.create({
        name: `${userList[counter]}'s Snack`,
        entreeType: 'Snacks',
      })
    );
    if (counter < 5) {
      counter++;
    } else {
      counter = 0;
    }
  }
  // await Promise.all(mealsBreakfast, mealsDinner, mealsLunch, mealsSnack);
  await Promise.all(mealsBreakfast);
  await Promise.all(mealsDinner);
  await Promise.all(mealsLunch);
  await Promise.all(mealsSnack);

  // Create longTermGoals
  for (let i = 1; i <= 2; i++) {
    await LongTermGoals.create({
      startWeight: 200,
      endingWeight: 180,
      startDate: '5-24-2019',
      endDate: '10-11-2019',
      userId: i,
      statedGoal: 'Lose 1 lb a week',
    });
  }

  // food1 - food20 is breakfast
  // food21 - food42 is lunch
  // food43 - food66 is dinner
  // food67 - food 80 is snacks

  // mealFoodItems - Breakfast
  for (let i = 1; i <= 60; i++) {
    let arr = [];
    while (arr.length < 3) {
      let random = Math.floor(Math.random() * 20 + 1);
      if (arr.indexOf(random) === -1) arr.push(random);
    }
    for (let j = 0; j < arr.length; j++) {
      const mealItems = await MealFoodItems.create({
        foodItemId: arr[j],
        mealId: i,
        quantity: 1,
      });
      MealFoodItems.beforeCreateSeed(mealItems);
    }
  }

  // mealFoodItems - Lunch
  for (let i = 61; i <= 120; i++) {
    let arr = [];
    while (arr.length < 3) {
      let random = Math.floor(Math.random() * 22 + 1);
      if (arr.indexOf(random) === -1) arr.push(random);
    }
    for (let j = 0; j < arr.length; j++) {
      const mealItems = await MealFoodItems.create({
        foodItemId: arr[j] + 20,
        mealId: i,
        quantity: 1,
      });
      MealFoodItems.beforeCreateSeed(mealItems);
    }
  }

  // mealFoodItems - Dinner
  for (let i = 121; i <= 180; i++) {
    let arr = [];
    while (arr.length < 3) {
      let random = Math.floor(Math.random() * 24 + 1);
      if (arr.indexOf(random) === -1) arr.push(random);
    }
    for (let j = 0; j < arr.length; j++) {
      const mealItems = await MealFoodItems.create({
        foodItemId: arr[j] + 42,
        mealId: i,
        quantity: 1,
      });
      MealFoodItems.beforeCreateSeed(mealItems);
    }
  }

  // mealFoodItems - Snacks
  for (let i = 181; i <= 240; i++) {
    let arr = [];
    while (arr.length < 3) {
      let random = Math.floor(Math.random() * 14 + 1);
      if (arr.indexOf(random) === -1) arr.push(random);
    }
    for (let j = 0; j < arr.length; j++) {
      const mealItems = await MealFoodItems.create({
        foodItemId: arr[j] + 66,
        mealId: i,
        quantity: 1,
      });
      MealFoodItems.beforeCreateSeed(mealItems);
    }
  }

  // UserMeals
  for (let i = 1; i <= 240; i++) {
    await UserMeals.create({
      timesEaten: 1 + Math.floor(Math.random() * 6),
      mealId: i,
      userId: [counter + 1],
    });
    if (counter < 5) {
      counter++;
    } else {
      counter = 0;
    }
  }

  await UserMeals.create({
    timesEaten: 6,
    mealId: 2,
    userId: 3,
  });
  await UserMeals.create({
    timesEaten: 6,
    mealId: 2,
    userId: 3,
  });
  await UserMeals.create({
    timesEaten: 6,
    mealId: 2,
    userId: 3,
  });

  // Create Favorite meal
  for (let i = 1; i <= 5; i++) {
    await FavoriteMeals.create({
      mealId: i,
      userId: 1,
    });
  }
  //create Favorite Food
  for (let i = 1; i <= 40; i++) {
    await FavoriteFoods.create({
      foodItemId: i,
      userId: Math.floor(Math.random() * 6) + 1,
    });
  }

  const mealDisplayDinner1 = await Meals.create({
    name: 'Low-Carb Dinner',
    entreeType: 'Dinner',
  });
  console.log(mealDisplayDinner1.id);

  const mealDisplayDinner2 = await Meals.create({
    name: 'High-Protein',
    entreeType: 'Dinner',
  });

  const mealDisplayDinner3 = await Meals.create({
    name: 'High-Fat Dinner',
    entreeType: 'Dinner',
  });

  const mealDinner1food1 = await MealFoodItems.create({
    mealId: mealDisplayDinner1.id,
    foodItemId: 47,
    quantity: 1,
  });
  const mealDinner1food2 = await MealFoodItems.create({
    mealId: mealDisplayDinner1.id,
    foodItemId: 41,
    quantity: 1,
  });
  const mealDinner1food3 = await MealFoodItems.create({
    mealId: mealDisplayDinner1.id,
    foodItemId: 53,
    quantity: 1,
  });

  MealFoodItems.beforeCreateSeed(mealDinner1food1);
  MealFoodItems.beforeCreateSeed(mealDinner1food2);
  MealFoodItems.beforeCreateSeed(mealDinner1food3);

  const mealDinner2Food1 = await MealFoodItems.create({
    mealId: mealDisplayDinner2.id,
    foodItemId: 64,
    quantity: 1
  })
  const mealDinner2Food2 = await MealFoodItems.create({
    mealId: mealDisplayDinner2.id,
    foodItemId: 65,
    quantity: 1
  })
  const mealDinner2Food3 = await MealFoodItems.create({
    mealId: mealDisplayDinner2.id,
    foodItemId: 66,
    quantity: 1
  })
  MealFoodItems.beforeCreateSeed(mealDinner2Food1);
  MealFoodItems.beforeCreateSeed(mealDinner2Food2);
  MealFoodItems.beforeCreateSeed(mealDinner2Food3)

  await UserMeals.create({
    userId: 3,
    mealId: mealDisplayDinner1.id,
    timesEaten: 40,
  });

  await UserMeals.create({
    userId: 3,
    mealId: mealDisplayDinner2.id,
    timesEaten: 35,
  });

  await
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
