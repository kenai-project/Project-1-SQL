const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoring.controller');

router.get('/kafka-lag', (req, res) => monitoringController.getKafkaLag(req, res));
router.get('/spark-job-status', (req, res) => monitoringController.getSparkJobStatus(req, res));
router.get('/spark-job-failures', (req, res) => monitoringController.checkSparkJobFailures(req, res));

module.exports = router;
