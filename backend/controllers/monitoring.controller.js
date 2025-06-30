const monitoringService = require('../services/monitoring.service');

class MonitoringController {
  async getKafkaLag(req, res) {
    const { topic, groupId } = req.query;
    if (!topic || !groupId) {
      return res.status(400).json({ message: 'topic and groupId query parameters are required' });
    }
    try {
      const lag = await monitoringService.getKafkaLag(topic, groupId);
      res.json({ lag });
    } catch (error) {
      console.error('MonitoringController.getKafkaLag error:', error.message);
      res.status(500).json({ message: 'Failed to get Kafka lag', error: error.message });
    }
  }

  async getSparkJobStatus(req, res) {
    const { appId } = req.query;
    if (!appId) {
      return res.status(400).json({ message: 'appId query parameter is required' });
    }
    try {
      const status = await monitoringService.getSparkJobStatus(appId);
      res.json({ status });
    } catch (error) {
      console.error('MonitoringController.getSparkJobStatus error:', error.message);
      res.status(500).json({ message: 'Failed to get Spark job status', error: error.message });
    }
  }

  async checkSparkJobFailures(req, res) {
    const { appId } = req.query;
    if (!appId) {
      return res.status(400).json({ message: 'appId query parameter is required' });
    }
    try {
      const hasFailures = await monitoringService.checkSparkJobFailures(appId);
      res.json({ hasFailures });
    } catch (error) {
      console.error('MonitoringController.checkSparkJobFailures error:', error.message);
      res.status(500).json({ message: 'Failed to check Spark job failures', error: error.message });
    }
  }

  async getPrometheusMetrics(req, res) {
    try {
      const metrics = await monitoringService.getMetrics();
      res.set('Content-Type', monitoringService.register.contentType);
      res.send(metrics);
    } catch (error) {
      console.error('MonitoringController.getPrometheusMetrics error:', error.message);
      res.status(500).json({ message: 'Failed to get Prometheus metrics', error: error.message });
    }
  }
}

module.exports = new MonitoringController();
