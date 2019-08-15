const { session } = require('../db');

const createUser = user => {
  session
    .run(
      `MERGE (u:User {id: $id})
    ON CREATE SET u += {weight: $weight, height: $height, age: $age, bodyType:$bodyType}
    RETURN u`,
      {
        id: user.id,
        weight: user.weight,
        height: user.height,
        age: user.age,
        bodyType: user.bodyType,
      }
    )
    .then(result => {
      session.close();
      if (!result.records.length) return null;
      const record = result.records[0];
      return record.get('u');
    })
    .catch(error => {
      session.close();
      throw error;
    });
};

module.exports = createUser;
