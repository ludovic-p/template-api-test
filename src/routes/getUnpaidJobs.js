const { Op } = require('sequelize');

const getUnpaidJobs = (app) => {
  app.get('/jobs/unpaid', async (req, res) => {
    const { Job, Contract } = req.app.get('models');
    const activeContracts = await Contract.findAll({
      attributes: ['id'],
      raw: true,
      where: {
        status: 'in_progress',
        [Op.or]: [ 
          { ClientId: req.profile.id }, 
          { ContractorId: req.profile.id } 
        ] 
      }
    });
    const activeContractsIds = activeContracts.map((contract) => contract.id);
    const unpaidJobs = await Job.findAll(
      { 
        where: { 
          paid: {
            [Op.is]: null
          },
          ContractId: { 
            [Op.in]: activeContractsIds
          }
        }
      }
    );
    res.json(unpaidJobs);
  });
};

module.exports = getUnpaidJobs;