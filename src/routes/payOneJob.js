const { Op } = require('sequelize');

const payOneJob = (app) => {
  app.post('/jobs/:job_id/pay', async (req, res) => {
    const { balance, type, id } = req.profile;
    const { Job, Contract, Profile } = req.app.get('models');
    const { job_id } = req.params;
    if (type === 'client') {
      const jobToPay = await Job.findOne({
        raw: true,
        attributes: ['price', 'ContractId'],
        where: { 
          id: job_id,
          paid : {
            [Op.is]: null
          }
        }
      });
      
      if (!jobToPay) {
        console.error('\x1b[31m No job to paid found\x1b[0m')
        return res.status(403).end()
      }

      const contractorToPay = await Contract.findOne({
        raw: true,
        attributes: [ 'ContractorId' ],
        where : { 
          id: jobToPay.ContractId,
        } 
      })

      if (balance >= jobToPay.price) {
        await Promise.all([
          Profile.decrement({ balance: jobToPay.price }, { where: { id } }),
          Profile.increment({ balance: jobToPay.price }, { where: { id: contractorToPay?.ContractorId } }),
          Job.update({ paid: true, paymentDate: Date.now() }, { where: { id: job_id } })
        ]);
      }
      res.status(200).end();
    } else {
      console.error('\x1b[31mCan\'t proceed this request with this rights\x1b[0m')
      return res.status(403).end();
    }
  });
};

module.exports = payOneJob;