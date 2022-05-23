const sequelize = require('../middleware/sequelize');
const { Model, DataTypes } = require('sequelize');

class Contract extends Model {}

Contract.init(
  {
    terms: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status:{
      type: DataTypes.ENUM('new','in_progress','terminated')
    }
  },
  {
    sequelize,
    modelName: 'Contract'
  }
);

const contractAPIDefinition = {
  name: 'contract',
  model: Contract,
};

module.exports = contractAPIDefinition;