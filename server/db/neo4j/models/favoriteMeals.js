const { session } = require('../db');

const createFavoriteMeal = userMeal => {
  session
    .run(
      `MATCH (u:User {id: $userId}), (m:Meal {id: $mealId})
      MERGE (u)-[:FAVORITED_MEAL]->(m)
      RETURN u, m`,
      {
        userId: userMeal.userId,
        mealId: userMeal.mealId,
      }
    )
    .then(result => {
      session.close();
      if (!result.records.length) return null;
      const record = result.records[0];
      return record.get('u', 'm');
    })
    .catch(error => {
      session.close();
      throw error;
    });
};

module.exports = createFavoriteMeal;
