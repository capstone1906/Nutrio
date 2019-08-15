const crypto = require('crypto');
const Sequelize = require('sequelize');
const db = require('../db');
const createUser = require('../../neo4j/models/users');

const Users = db.define('users', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password');
    },
  },
  height: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  weight: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  activityLevel: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  bodyType: {
    type: Sequelize.STRING,
    allowNull: false,
    // validate: {
    //   isEmpty: false,
    // },
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt');
    },
  },
  googleId: {
    type: Sequelize.STRING,
  },
});

module.exports = Users;

/**
 * instanceMethods
 */
Users.prototype.correctPassword = function(candidatePwd) {
  return Users.encryptPassword(candidatePwd, this.salt()) === this.password();
};

/**
 * classMethods
 */
Users.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64');
};

Users.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex');
};

/**
 * hooks
 */
const setSaltAndPassword = users => {
  if (users.changed('password')) {
    users.salt = Users.generateSalt();
    users.password = Users.encryptPassword(users.password(), users.salt());
  }
};

Users.beforeCreate(setSaltAndPassword);
Users.beforeUpdate(setSaltAndPassword);
Users.beforeBulkCreate(users => {
  users.forEach(setSaltAndPassword);
});

Users.afterSave(async user => {
  const newUser = await createUser(user);
  return newUser;
});
