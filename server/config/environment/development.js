'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/luckynight-dev'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'dev.sqlite',
      define: {
        timestamps: false
      }
    }
  },

  seedDB: true
};
