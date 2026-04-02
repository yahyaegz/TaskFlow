const repository = require('./analytics.repository.js');

async function getProductivity(req, res) {
  const stats = await repository.getProductivityStats(req.user.id);
  res.json({
    success: true,
    data: stats
  });
}

module.exports = {
  getProductivity
};
