const { Op } = require('sequelize');

/**
 * Allow to get one contracts belongs to a profile
 * @param {Object} app - Express application
 * @returns {Contract} Array of Contracts object
 */
const getOneContract = (app) => {
  app.get('/contracts/:id', async (req, res) => {
    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const contract = await Contract.findOne({ 
      where: { 
        id, 
        [Op.or]: [ 
          { ClientId: req.profile.id }, 
          { ContractorId: req.profile.id } 
        ] 
      } 
    });
    if(!contract) return res.status(404).end()
    res.json(contract);
  });
};

module.exports = getOneContract;