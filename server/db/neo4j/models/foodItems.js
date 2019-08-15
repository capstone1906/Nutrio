const { session } = require('../db');

const createFood = food => {
  session
    .run(
      `MERGE (f:Food {id: $id})
    ON CREATE SET f += {calories: $calories, carbohydrates: $carbohydrates, protein: $protein, fat: $fat, dominantMacro: $dominantMacro}
    RETURN f`,
      {
        id: food.id,
        calories: food.calories,
        carbohydrates: food.carbohydrates,
        protein: food.protein,
        fat: food.fat,
        dominantMacro: food.dominantMacro,
      }
    )
    .then(result => {
      session.close();
      if (!result.records.length) return null;
      const record = result.records[0];
      return record.get('f');
    })
    .catch(error => {
      session.close();
      throw error;
    });
};

module.exports = createFood
