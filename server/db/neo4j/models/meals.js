const { session } = require('../db');

const createMeal = meal => {
  session
    .run(
      `MERGE (m:Meal {id: toInteger($id)})
      ON CREATE SET m += {
        name: $name,
        totalCalories: $totalCalories,
        totalCarbs: $totalCarbs,
        totalFat: $totalFat,
        totalProtein: $totalProtein,
        dominantMacro: $dominantMacro,
        entreeType: $entreeType
      }
      ON MATCH SET m += {
        name: $name,
        totalCalories: $totalCalories,
        totalCarbs: $totalCarbs,
        totalFat: $totalFat,
        totalProtein: $totalProtein,
        dominantMacro: $dominantMacro,
        entreeType: $entreeType
      }
      RETURN m`,
      {
        id: meal.id,
        name: meal.name,
        totalCalories: meal.totalCalories,
        totalCarbs: meal.totalCarbs,
        totalFat: meal.totalFat,
        totalProtein: meal.totalProtein,
        dominantMacro: meal.dominantMacro,
        entreeType: meal.entreeType,
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

const getRecommendedMeals = meal => {
  session
    .run(
      `MATCH ()-[r:HAD_MEAL]->(m:Meal)
    WHERE m.totalCalories < $calories AND  m.totalCarbs < $carbs AND m.totalFat < $fat AND m.totalProtein < $protein AND m.entreeType = $type
    RETURN sum(r.timesEaten) as total, m.id
    ORDER BY total DESC`,
    {
      calories: meal.calories,
      carbs: meal.carbs,
      fat: meal.fat,
      protein: meal.protein,
      type: meal.type
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

module.exports = { createMeal, getRecommendedMeals };
