const router = require("express").Router();
const { MealFoodItems, FoodItems, Meals } = require("../db/postgres/models/index");
module.exports = router;


router.post('/:id', async(req, res, next) => {
    try{
        console.log('req body', req.body)
        const foodItem = await FoodItems.create(req.body)


        const mealFoodItem = await MealFoodItems.create({
            foodItemId: foodItem.id,
            mealId: req.params.id,
            quantity: 1,
            calories: (foodItem.calories * 1)
        })

        res.json({foodItem, mealFoodItem})
    }
    catch(err) {
        next(err)
    }
})