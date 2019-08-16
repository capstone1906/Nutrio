const { session } = require('../db');

const createMeal = meal => {
  session
    .run(
      `MERGE (m:Meal {id: toInteger($id)})
      ON CREATE SET m += {
        name: $name,
        averageRating: $averageRating,
        totalCalories: $totalCalories,
        totalCarbs: $totalCarbs,
        totalFat: $totalFat,
        totalProtein: $totalProtein,
        dominantMacro: $dominantMacro,
        entreeType: $entreeType
      }
      ON MATCH SET m += {
        name: $name,
        averageRating: $averageRating,
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
        averageRating: meal.averageRating,
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

module.exports = createMeal;
