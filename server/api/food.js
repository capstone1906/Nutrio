const router = require('express').Router();
const { FoodItems } = require('../db/postgres/models/index');
module.exports = router;
const {
  getRecommendedFoods,
} = require('../../server/db/neo4j/models/foodItems');

// at route /food

router.get('/', async (req, res, next) => {
  try {
    const foods = await FoodItems.findAll();
    res.json(foods);
  } catch (err) {
    next(err);
  }
});

router.get('/:name', async (req, res, next) => {
  try {
    const foods = await FoodItems.findOne({
      where: {
        food_name: req.params.name,
      },
    });
    res.json(foods);
  } catch (err) {
    next(err);
  }
});

router.get('/recommendedFoods/food', async (req, res, next) => {
  const food = {
    calories: Number(req.query.calories),
    carbs: Number(req.query.carbs),
    protein: Number(req.query.protein),
    fat: Number(req.query.fat),
  };
  try {
    const foods = await getRecommendedFoods(food);
    const foodsRes = foods.map(m => {
      return FoodItems.findByPk(m);
    });
    const response = await Promise.all(foodsRes);
    res.json(response);
  } catch (err) {
    next(err);
  }
});
