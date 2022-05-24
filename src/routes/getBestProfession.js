const { Op } = require('sequelize');

/**
 * Allow to get the profession name that earned the most money for any contractor that worked on the
 * query time range
 * @param {Object} app - Express application
 * @returns {Object.<string, string>} best profession name
 */
const getBestProfession = (app) => {
  app.get('/admin/best-profession', async (req, res) => {
    const { Profile, Contract, Job } = req.app.get('models');
    const { start, end } = req.query;
    if (!start || !end || isNaN(new Date(start)) || isNaN(new Date(end))) {
      console.error('\x1b[31mBad queries\x1b[0m');
      return res.status(400).end();
    }
    const jobsPaidInTheQueryTimeRange = await Job.findAll({
      attributes: ['ContractId', 'price'],
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [new Date(start), new Date(end)]
        }
      }
    });

    // Allow to group the Jobs belongs to a ContractId and have the sum of their prices
    const jobsSumLinkedToContractId = jobsPaidInTheQueryTimeRange.reduce((acc, job) => {
      if (!acc[job.ContractId]) {
        return { ...acc, [job.ContractId]: job.price };
      }
      return { ...acc, [job.ContractId]: acc[job.ContractId] + job.price };
    }, {});

    const bestContractId = Object.keys(jobsSumLinkedToContractId).reduce((bestContractId, contractId) => {
      if (!bestContractId || jobsSumLinkedToContractId[contractId] > jobsSumLinkedToContractId[bestContractId]) {
        return contractId;
      }
      return bestContractId;
    });
    const contract = await Contract.findOne({ 
      raw: true,
      attributes: ['ContractorId'],
      where: { 
        id: bestContractId
      } 
    });
      
    const profile = await Profile.findOne({ where: { id: contract?.ContractorId } });

    return res.json({ bestProfession: profile.profession });
  });
};

module.exports = getBestProfession;