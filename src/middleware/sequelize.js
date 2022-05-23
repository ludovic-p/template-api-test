const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3',
  logging: process.env.SEQUELIZE_LOGS === 'true' ? console.log : false 
});

module.exports = sequelize;
