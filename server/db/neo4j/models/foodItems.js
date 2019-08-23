const { session } = require('../db');

const createFood = food => {
  session
    .run(
      `MERGE (f:Food {id: $id})
      ON CREATE SET f += {
        calories: $calories,
        carbohydrates: $carbohydrates,
        protein: $protein,
        fat: $fat,
        dominantMacro: $dominantMacro
      }
      ON MATCH SET f += {
         calories: $calories,
         carbohydrates: $carbohydrates,
         protein: $protein,
         fat: $fat,
         dominantMacro: $dominantMacro
      }
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

const getRecommendedFoods = food => {
  return session
    .run(
      `MATCH ()-[r:HAD_FOOD]->(f:Food)
      WHERE f.calories < $calories
      RETURN sum(r.timesEaten) as total, f.id
      ORDER BY total DESC LIMIT 40`,
      {
        calories: food.calories,
        carbs: food.carbs,
        fat: food.fat,
        protein: food.protein,
      }
    )
    .then(result => {
      session.close();
      return (res = result.records.map(rec => {
        return rec.get('f.id');
      }));
    })
    .catch(error => {
      session.close();
      throw error;
    });
};
module.exports = {createFood, getRecommendedFoods};
