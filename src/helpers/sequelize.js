const sequelize = require('../middleware/sequelize');

const syncModels = () => {
  sequelize.sync().then(() => {
    console.log('\x1b[35mSequelize client is ready\x1b[0m');
  }, 
  (err) => {
    console.error('Unable to connect to the database:', err);
  });
};


const createSequelizeAssociations = () => {
  try {

    sequelize.models.Profile.hasMany(sequelize.models.Contract, {as :'Contractor',foreignKey:'ContractorId'});
    sequelize.models.Contract.belongsTo(sequelize.models.Profile, {as: 'Contractor'});
    sequelize.models.Profile.hasMany(sequelize.models.Contract, {as : 'Client', foreignKey:'ClientId'});
    sequelize.models.Contract.belongsTo(sequelize.models.Profile, {as: 'Client'});
    sequelize.models.Contract.hasMany(sequelize.models.Job);
    sequelize.models.Job.belongsTo(sequelize.models.Contract);
    return true;
  } catch (err) {
    console.error('Error with Sequelize associations declarations:', err);
    throw err;
  }
};



module.exports = {
  createSequelizeAssociations,
  syncModels
};
