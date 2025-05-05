const sparkService = require('../services/spark.service');

class SparkController {
  async runQuery(req, res) {
    const { sql } = req.body;
    if (!sql) {
      return res.status(400).json({ message: 'SQL query is required' });
    }

    try {
      const result = await sparkService.query(sql);
      res.json(result);
    } catch (error) {
      console.error('SparkController.runQuery error:', error.message);
      res.status(500).json({ message: 'Failed to execute query', error: error.message });
    }
  }
}

module.exports = new SparkController();
