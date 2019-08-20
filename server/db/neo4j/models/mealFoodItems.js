const { session } = require('../db');

const createMealFoodItems = mealFoodItem => {
  session
    .run(
      `MATCH (f:Food {id: $foodId}), (m:Meal {id: $mealId})
    MERGE (m)-[r:HAS_FOOD]->(f)
    ON CREATE SET r.quantity = $quantity
    ON MATCH SET r.quantity = $quantity
    RETURN f, r, m`,
      {
        foodId: mealFoodItem.foodItemId,
        mealId: mealFoodItem.mealId,
        quantity: mealFoodItem.quantity,
      }
    )
    .then(result => {
      session.close();
      if (!result.records.length) return null;
      const record = result.records[0];
      const response = record.get('m');
      return response;
    })
    .catch(error => {
      session.close();
      throw error;
    });
};

module.exports = createMealFoodItems;
