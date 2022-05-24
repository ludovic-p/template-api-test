const { Op } = require('sequelize');

/**
 * Allow to get non terminated contracts belongs to a profile
 * @param {Object} app - Express application
 * @returns {Array.<Contract>} Array of Contracts object
 */
const getContracts = (app) => {
  app.get('/contracts', async (req, res) => {
    const { Contract } = req.app.get('models');
    const contracts = await Contract.findAll(
      { 
        where: { 
          status: {
            [Op.ne]: 'terminated'
          },
          [Op.or]: [ 
            { ClientId: req.profile.id }, 
            { ContractorId: req.profile.id } 
          ] 
        }
      }
    );
    res.json(contracts);
  });
};

module.exports = getContracts;