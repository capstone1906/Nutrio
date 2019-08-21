const { session } = require('../db');

const createUserFood = userFood => {
  session
    .run(
      `MATCH (u:User {id: $userId}), (f:Food {id: $foodItemId})
      MERGE (u)-[r:HAD_FOOD]->(f)
      ON CREATE SET r.timesEaten = $timesEaten
      ON MATCH SET r.timesEaten = $timesEaten
      RETURN u, r, f`,
      {
        userId: userFood.userId,
        foodItemId: userFood.foodItemId,
        timesEaten: userFood.timesEaten,
      }
    )
    .then(result => {
      session.close();
      if (!result.records.length) return null;
      const record = result.records[0];
      return record.get('u', 'r', 'f');
    })
    .catch(error => {
      session.close();
      throw error;
    });
};

module.exports = createUserFood;
