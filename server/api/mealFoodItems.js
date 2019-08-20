const router = require("express").Router();
const {
  MealFoodItems,
  FoodItems,
  Meals
} = require("../db/postgres/models/index");
module.exports = router;


router.get('/:foodId/:mealId', async(req, res, next) => {
  try{
    const mealFoodItem = await MealFoodItems.findOne({
      where: {
        foodItemId: req.params.foodId,
        mealId: req.params.mealId
      }
    });

    res.json(mealFoodItem)
    }
  catch(err) {
    next(err)
  }
})

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

router.post("/:id/:quantity", async (req, res, next) => {
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
        quantity: req.params.quantity,
        calories: foodItem[0].calories * req.params.quantity
      }
    });    

    if(mealFoodItem[1] === false) {
      var quantity = parseInt(req.params.quantity)
      await mealFoodItem[0].update({
        quantity: quantity,
        calories: foodItem[0].calories * quantity
      })
    }

    res.json({ foodItem, mealFoodItem });
  } catch (err) {
    next(err);
  }
});
