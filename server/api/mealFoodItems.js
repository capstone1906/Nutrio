const router = require("express").Router();
const {
  MealFoodItems,
  FoodItems,
  Meals
} = require("../db/postgres/models/index");
module.exports = router;

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

router.post("/:id", async (req, res, next) => {
  try {
    const foodItem = await FoodItems.findOrCreate({
      where: {
        food_name: req.body.food_name
      },
      defaults: req.body
    });


    const mealFoodItem = await MealFoodItems.findOrCreate({
      where: {
        foodItemId: foodItem[0].id,
        mealId: req.params.id
      },
      defaults: {
        foodItemId: foodItem[0].id,
        mealId: req.params.id,
        quantity: 1,
        calories: foodItem[0].calories * 1
      }
    });


    // console.log('mealFoodItem', mealFoodItem[1])


    if(mealFoodItem[1] === false) {
      await mealFoodItem[0].update({
        quantity: mealFoodItem[0].quantity += 1
      })
    }

    res.json({ foodItem, mealFoodItem });
  } catch (err) {
    next(err);
  }
});
