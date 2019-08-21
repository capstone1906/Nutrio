const { session } = require('../db');

const createFavoriteFood = userFood => {
  session
    .run(
      `MATCH (u:User {id: $userId}), (f:Food {id: $foodItemId})
      MERGE (u)-[:FAVORITED_FOOD]->(f)
      RETURN u, f`,
      {
        userId: userFood.userId,
        foodItemId: userFood.foodItemId,
      }
    )
    .then(result => {
      session.close();
      if (!result.records.length) return null;
      const record = result.records[0];
      return record.get('u', 'f');
    })
    .catch(error => {
      session.close();
      throw error;
    });
};

module.exports = createFavoriteFood;
