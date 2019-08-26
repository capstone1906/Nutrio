const crypto = require('crypto');
const Sequelize = require('sequelize');
const db = require('../db');
const createUser = require('../../neo4j/models/users');
const LongTermGoals = require('./longTermGoals');
const DailyGoals = require('./dailyGoals');

const Users = db.define('users', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gender: {
    type: Sequelize.STRING,
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
    validate: {
      min: 36,
      max: 120,
    },
  },
  weight: {
    type: Sequelize.FLOAT,
    allowNull: false,
    validate: {
      min: 50,
      max: 400,
    },
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 15,
      max: 120,
    },
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

  const longTermGoal = await LongTermGoals.findOne({
    where: {
      userId: user.id,
    },
  });

  const dailyGoal = await DailyGoals.findOne({
    where: {
      userId: user.id,
    },
  });

  if (dailyGoal && longTermGoal) {
    var bmr = Math.floor(
      (10 * user.weight +
        6.25 * (user.height * 0.39370079) -
        5 * user.age +
        5) *
        user.activityLevel
    );

    if (longTermGoal.statedGoal === 'Lose 2 lbs a week') {
      bmr = bmr - 1000;
    } else if (longTermGoal.statedGoal === 'Lose 1.5 lbs a week') {
      bmr = bmr - 750;
    } else if (longTermGoal.statedGoal === 'Lose 1 lb a week') {
      bmr = bmr - 500;
    } else if (longTermGoal.statedGoal === 'Lose 0.5 lb a week') {
      bmr = bmr - 250;
    } else if (longTermGoal.statedGoal === 'Maintain weight') {
      bmr = bmr;
    } else if (longTermGoal.statedGoal === 'Gain 0.5 lb a week') {
      bmr = bmr + 250;
    } else if (longTermGoal.statedGoal === 'Gain 1 lb a week') {
      bmr = bmr + 500;
    }
    var proteinLimit;
    var carbLimit;
    var fatLimit;

    if (user.bodyType === 'Ectomorph') {
      proteinLimit = Math.floor((bmr * 0.25) / 4);
      carbLimit = Math.floor((bmr * 0.55) / 4);
      fatLimit = Math.floor((bmr * 0.2) / 9);
    } else if (user.bodyType === 'Mesomorph') {
      proteinLimit = Math.floor((bmr * 0.3) / 4);
      carbLimit = Math.floor((bmr * 0.4) / 4);
      fatLimit = Math.floor((bmr * 0.3) / 9);
    } else if (user.bodyType === 'Endomorph') {
      proteinLimit = Math.floor((bmr * 0.35) / 4);
      carbLimit = Math.floor((bmr * 0.25) / 4);
      fatLimit = Math.floor((bmr * 0.4) / 9);
    }

    await dailyGoal.update({
      calorieLimit: bmr,
      proteinLimit,
      carbLimit,
      fatLimit,
    });
  }

  return newUser;
});
