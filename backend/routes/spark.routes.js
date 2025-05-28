const express = require('express');
const router = express.Router();
const sparkController = require('../controllers/spark.controller');

router.post('/query', (req, res) => sparkController.runQuery(req, res));
router.post('/streaming-job', (req, res) => sparkController.runStreamingJob(req, res));

module.exports = router;
