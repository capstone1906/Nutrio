const Sequelize = require('sequelize')


const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/nutrition-tracker`,
  {
    logging: false
  }
)
module.exports = db


if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close())
}
