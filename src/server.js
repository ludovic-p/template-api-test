require('dotenv').config()
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const Package = require('../package.json');
const loadModels = require('./models');
const loadRoutes = require('./routes');
const sequelize = require('./middleware/sequelize');
const getProfile = require('./middleware/getProfile');
const {
  createSequelizeAssociations,
  syncModels
} = require('./helpers/sequelize');

loadModels();
createSequelizeAssociations();
syncModels();

const app = express();
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(getProfile);
app.set('models', sequelize.models);

loadRoutes(app);

async function init() {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`\x1b[33m###################################`);
      console.log(`\x1b[33mService : API ${Package.name}@${Package.version}`);
      console.log(`\x1b[33m${process.env.NODE_ENV.toUpperCase()} environment used`);
      console.log(`\x1b[33mServer started on port ${process.env.PORT} ! ✓`);
      console.log(`\x1b[33m###################################\x1b[0m`);
    });
  } catch (error) {
    console.error(`\x1b[31mAn error occurred: ${JSON.stringify(error)}\x1b[0m`);
    process.exit(1);
  }
}

init();