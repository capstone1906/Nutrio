const router = require("express").Router();
const {
  MealFoodItems,
  FoodItems,
  Meals
} = require("../db/postgres/models/index");
module.exports = router;

router.get("/:foodId/:mealId", async (req, res, next) => {
  try {
    const mealFoodItem = await MealFoodItems.findOne({
      where: {
        foodItemId: req.params.foodId,
        mealId: req.params.mealId
      }
    });

    res.json(mealFoodItem);
  } catch (err) {
    next(err);
  }
});

router.delete("/:foodId/:mealId", async (req, res, next) => {
  try {
    const mealFoodItem = await MealFoodItems.findOne({
      where: {
        foodItemId: req.params.foodId,
        mealId: req.params.mealId
      }
    });

    await mealFoodItem.destroy();
  } catch (err) {
    next(err);
  }
});

router.post("/:id/:quantity/:grams", async (req, res, next) => {
  try {

    const foodItem = await FoodItems.findOrCreate({
      where: {
        food_name: req.body.food_name
      },
      defaults: req.body
    });

    var quantity = req.params.quantity;
    var grams = req.params.grams;

    var calsGram = foodItem[0].calories/foodItem[0].weight

    var fatGram = foodItem[0].fat/foodItem[0].weight
    var carbsGram = foodItem[0].carbohydrates/foodItem[0].weight
    var proteinGram = foodItem[0].protein/foodItem[0].weight

    const mealFoodItem = await MealFoodItems.findOrCreate({
      where: {
        foodItemId: foodItem[0].id,
        mealId: req.params.id
      },
      defaults: {
        foodItemId: foodItem[0].id,
        mealId: req.params.id,
        quantity: (grams === 0 ? quantity : 0),
        grams: (grams === 1 ? quantity : 0),
        calories: (quantity * (grams === 0 ? foodItem[0].calories : calsGram))
      }
    });

    if (mealFoodItem[1] === false) {

      await mealFoodItem[0].update({
        quantity: (grams === 0 ? quantity : 0),
        grams: (grams === 1 ? quantity : 0),
        calories: (quantity * (grams === 0 ? foodItem[0].calories : calsGram))
      });
    }

    res.json({ foodItem, mealFoodItem });
  } catch (err) {
    next(err);
  }
});
