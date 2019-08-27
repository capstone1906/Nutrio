const router = require('express').Router();
module.exports = router;
const {
  FavoriteMeals,
  Meals,
  FoodItems,
} = require('../db/postgres/models/index');

router.get('/:userId', async (req, res, next) => {
  try {
    const favoriteMeals = await FavoriteMeals.findAll({
      where: { userId: Number(req.params.userId) },
    });

    const meals = favoriteMeals.map(m => {
      return Meals.findOne({
        where: {
          id: m.mealId,
        },
        include: [FoodItems],
      });
    });
    const response = await Promise.all(meals);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

router.post('/:userId/:mealId', async (req, res, next) => {
  try {
    const newFavoriteMeal = await FavoriteMeals.findOrCreate({
      where: {
        userId: Number(req.params.userId),
        mealId: Number(req.params.mealId),
      },
    });
    const meal = await Meals.findOne({
      where: { id: newFavoriteMeal[0].mealId },
      include: [FoodItems],
    });
    res.json(meal);
  } catch (err) {
    next(err);
  }
});
