const router = require('express').Router();
const {
  MealFoodItems,
  FoodItems,
  Meals,
  CheckIns
} = require('../db/postgres/models/index');
module.exports = router;

router.get('/:foodId/:mealId', async (req, res, next) => {
  try {
    const mealFoodItem = await MealFoodItems.findOne({
      where: {
        foodItemId: req.params.foodId,
        mealId: req.params.mealId,
      },
    });

    res.json(mealFoodItem);
  } catch (err) {
    next(err);
  }
});

router.delete('/:foodId/:mealId/:userId', async (req, res, next) => {
  try {
    const mealFoodItem = await MealFoodItems.findOne({
      where: {
        foodItemId: req.params.foodId,
        mealId: req.params.mealId,
      },
    });

    var todaysCheckIn = await CheckIns.findAll({
      where: {
        userId: req.params.userId
      },
      order: [['id', "DESC"]]
    })

    todaysCheckIn = todaysCheckIn[0]
    

    await todaysCheckIn.update({
      caloriesConsumed: todaysCheckIn.caloriesConsumed - mealFoodItem.calories
    })

    await mealFoodItem.destroy();
    const updatedMeal = await Meals.findByPk(req.params.mealId, {
      include: [FoodItems]
    })
    res.json(updatedMeal)
  } catch (err) {
    next(err);
  }
});

router.post('/:id/:quantity/:grams/:userId', async (req, res, next) => {
  try {
    const foodItem = await FoodItems.findOrCreate({
      where: {
        food_name: req.body.food_name,
      },
      defaults: req.body,
    });

    var todaysCheckIn = await CheckIns.findAll({
      where: {
        userId: req.params.userId
      },
      order: [['id', "DESC"]]
    })

    todaysCheckIn = todaysCheckIn[0]
    


    var quantity = Number(req.params.quantity)
    var grams = parseInt(req.params.grams);
    var calsGram = foodItem[0].calories / foodItem[0].weight;
    var fatGram = foodItem[0].fat / foodItem[0].weight;
    var carbsGram = foodItem[0].carbohydrates / foodItem[0].weight;
    var proteinGram = foodItem[0].protein / foodItem[0].weight;

    const mealFoodItem = await MealFoodItems.findOrCreate({
      where: {
        foodItemId: foodItem[0].id,
        mealId: req.params.id,
      },
      defaults: {
        foodItemId: foodItem[0].id,
        mealId: req.params.id,
        quantity: grams === 0 ? quantity : 0,
        grams: grams === 1 ? quantity : 0,
        calories: quantity * (grams === 0 ? foodItem[0].calories : calsGram),
        carbs: quantity * (grams === 0 ? foodItem[0].carbohydrates : carbsGram),
        fat: quantity * (grams === 0 ? foodItem[0].fat : fatGram),
        protein: quantity * (grams === 0 ? foodItem[0].protein : proteinGram),

      },
    });

    if (mealFoodItem[1] === false) {

      await todaysCheckIn.update({
        caloriesConsumed: todaysCheckIn.caloriesConsumed - mealFoodItem[0].calories
      })

      await mealFoodItem[0].update({
        quantity: grams === 0 ? quantity : 0,
        grams: grams === 1 ? quantity : 0,
        calories: quantity * (grams === 0 ? foodItem[0].calories : calsGram),
      });

      await todaysCheckIn.update({
        caloriesConsumed: todaysCheckIn.caloriesConsumed + mealFoodItem[0].calories
      })
    }
    else {
      await todaysCheckIn.update({
        caloriesConsumed: todaysCheckIn.caloriesConsumed + mealFoodItem[0].calories
      })
    }

    res.json({ foodItem, mealFoodItem });
  } catch (err) {
    next(err);
  }
});
