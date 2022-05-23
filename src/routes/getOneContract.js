
const getOneContract = (app) => {
  app.get('/contracts/:id', async (req, res) => {
    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const contract = await Contract.findOne({ where: { id, ClientId: req.profile.id } });
    if(!contract) return res.status(404).end()
    res.json(contract);
  });
};

module.exports = getOneContract;