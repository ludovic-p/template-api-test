const { Op } = require('sequelize');
const DEFAULT_LIMIT_VALUE = 2;

const sortBestClientByPaidFn = (a, b) => {
  if ( a.paid < b.paid ){
    return -1;
  }
  if ( a.paid > b.paid ){
    return 1;
  }
  return 0;
};

/**
 * Allow to get the clients the paid the most for jobs in the query time period
 * @param {Object} app - Express application
 * @returns {Array.<Profile>} Array of clients
 */
const getBestClients = (app) => {
  app.get('/admin/best-clients', async (req, res) => {
    const { Profile, Contract, Job } = req.app.get('models');
    const { start, end, limit } = req.query;
    if (!start || !end || isNaN(new Date(start)) || isNaN(new Date(end))) {
      console.error('\x1b[31mBad queries\x1b[0m');
      return res.status(400).end();
    }
    const jobsPaidInTheQueryTimeRange = await Job.findAll({
      limit: !isNaN(limit) ? limit : DEFAULT_LIMIT_VALUE,
      attributes: ['ContractId', 'price'],
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [new Date(start), new Date(end)]
        }
      }
    });

    // Allow to keep only the best Jobs belongs to a ContractId and have the sum of their prices
    const contractIdsWithHighestPaidJobs = jobsPaidInTheQueryTimeRange.reduce((acc, job) => {
      if (!acc[job.ContractId] || job.price > acc[job.ContractId]) {
        return { ...acc, [job.ContractId]: job.price };
      }
      return acc;
    }, {});

    const contractIds = Object.keys(contractIdsWithHighestPaidJobs);

    const contracts = await Contract.findAll({ 
      raw: true,
      attributes: ['id', 'ClientId'],
      where: { 
        id: {
          [Op.in]: contractIds
        }
      }
    });
    const profileIds = [];
    const profileIdsWithContractIdAndPaidProperty = contracts.map(({id, ClientId}) => { 
      profileIds.push(ClientId);
      return {
        profileId: ClientId,
        contractId: id,
        paid: contractIdsWithHighestPaidJobs[id]
      };
    });
      
    const profiles = await Profile.findAll({
      raw: true,
      attributes: ['id', 'firstName', 'lastName'],
      where: {
        id: {
          [Op.in]: profileIds 
        }
      }
    });

    const formattedBestClient = profiles.map((profile) => {
      const profileEntityLinkedToCurrentContractId = profileIdsWithContractIdAndPaidProperty.filter((profileEntity) => {
        return profileEntity.profileId === profile.id;
      })?.[0];
      return {
        id: profile.id,
        paid: profileEntityLinkedToCurrentContractId?.paid,
        fullname: `${profile.firstName} ${profile.lastName}`,
      };
    });

    const bestClientSorted = formattedBestClient.sort(sortBestClientByPaidFn)

    return res.json(bestClientSorted);
  });
};

module.exports = getBestClients;