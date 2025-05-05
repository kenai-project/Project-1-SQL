const dremioService = require('../services/dremio.service');

class DremioController {
  async runQuery(req, res) {
    const { sql } = req.body;
    if (!sql) {
      return res.status(400).json({ message: 'SQL query is required' });
    }

    try {
      const result = await dremioService.query(sql);
      res.json(result);
    } catch (error) {
      console.error('DremioController.runQuery error:', error.message);
      res.status(500).json({ message: 'Failed to execute query', error: error.message });
    }
  }
}

module.exports = new DremioController();
