const router = require("express").Router();
const {
  MealFoodItems,
  FoodItems,
  Meals
} = require("../db/postgres/models/index");
module.exports = router;


router.delete('/:foodId/:mealId', async(req, res, next)=> {
    try{
        console.log('here', req.params.foodId), req.params.mealId
        const mealFoodItem = await MealFoodItems.findOne({
            where: {
                foodItemId: req.params.foodId,
                mealId: req.params.mealId
            }
        })

        await mealFoodItem.destroy()
    
    }
    catch(err) {
        next(err)
    }
})


router.post("/:id", async (req, res, next) => {
  try {
    const foodItem = await FoodItems.create(req.body);

    const mealFoodItem = await MealFoodItems.create({
      foodItemId: foodItem.id,
      mealId: req.params.id,
      quantity: 1,
      calories: foodItem.calories * 1
    });

    res.json({ foodItem, mealFoodItem });
  } catch (err) {
    next(err);
  }
});
