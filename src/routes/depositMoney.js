const { Op } = require('sequelize');
const MAX_PERCENTAGE_OF_DEPOSIT = 0.25;

const depositMoney = (app) => {
  app.post('/balances/deposit/:userId', async (req, res) => {
    const { Profile, Contract, Job } = req.app.get('models');
    const { userId } = req.params;
    const { amount } = req.body;

    const userToAddMoney = await Profile.findOne({ 
      raw: true,
      attributes: [ 'id' ],
      where: {
        id: userId,
        type: 'client'
      } 
    });
    if (!userToAddMoney) {
      console.error('\x1b[31mCan\'t find client with the userId supplied\x1b[0m');
      return res.status(403).end();
    }
    const contractsBelongsToUser = await Contract.findAll({
      raw: true,
      attributes: [ 'id' ],
      where: { ClientId: userId }
    });
    const contractIds = contractsBelongsToUser.map(({ id }) => id);
    
    console.log('contractIds', contractIds);
    
    const jobsToPay = await Job.findAll(
      {
        raw: true,
        attributes: [ 'price' ],
        where: {
          paid: {
            [Op.is]: null
          },
          ContractId: {
            [Op.or]: contractIds
          }
        }
      }
    );

    const sumOfTotalJobsToPay = jobsToPay.reduce((acc, job) => {
      return acc + job.price;
    }, 0)

    if (!isNaN(amount) && amount <= sumOfTotalJobsToPay * MAX_PERCENTAGE_OF_DEPOSIT) {
      await Profile.increment({ balance: amount }, { where: { id: userId } });
      return res.json();
    }
    console.error('\x1b[31mThe amount supply doesn\'t respect the max percentage of deposit\x1b[0m');
    return res.status(403).end();
  });
};

module.exports = depositMoney;