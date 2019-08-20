const { session } = require('../db');

const createUserMeal = userMeal => {
  session
    .run(
      `MATCH (u:User {id: $userId}), (m:Meal {id: $mealId})
      MERGE (u)-[r:HAD_MEAL]->(m)
      ON CREATE SET r.timesEaten = $timesEaten
      ON MATCH SET r.timesEaten = $timesEaten
      RETURN u, r, m`,
      {
        userId: userMeal.userId,
        mealId: userMeal.mealId,
        timesEaten: userMeal.timesEaten,
      }
    )
    .then(result => {
      session.close();
      if (!result.records.length) return null;
      const record = result.records[0];
      return record.get('u', 'r', 'm');
    })
    .catch(error => {
      session.close();
      throw error;
    });
};

module.exports = createUserMeal;
