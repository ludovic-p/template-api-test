const sequelize = require('../middleware/sequelize');
const { Model, DataTypes } = require('sequelize');

class Job extends Model {}
Job.init(
  {
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false
    },
    paid: {
      type: DataTypes.BOOLEAN,
      default:false
    },
    paymentDate: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    modelName: 'Job'
  }
);

const jobAPIDefinition = {
  name: 'job',
  model: Job,
};

module.exports = jobAPIDefinition;