# Monitoring Configuration and Testing

This directory contains configuration files, scripts, and documentation for monitoring Kafka, Debezium, PostgreSQL, and application metrics using Prometheus, Grafana, Datadog, and ELK stack.

## Files

- `simulate-kafka-lag.js`: Script to simulate Kafka consumer lag by pausing consumption.
- `grafana-dashboard.json`: Prebuilt Grafana dashboard JSON with panels for Kafka, Debezium, PostgreSQL, and app metrics.
- `prometheus.yml`: Prometheus scrape configuration for the metrics endpoint.
- `datadog-docker-agent.yaml`: Datadog agent configuration with Prometheus integration.
- `elk-metricbeat-filebeat-setup.md`: Guide for setting up ELK stack with Metricbeat and Filebeat.
- `extended-test-plan.md`: Comprehensive test plan for validating monitoring implementation.
- `extended-test-script.js`: Automated test script for basic monitoring endpoint validation.

## Usage

1. **Kafka Lag Simulation**

   Run the lag simulation script to test Kafka ingestion lag metric:

   ```
   node simulate-kafka-lag.js --topic your_topic --group your_group --pauseMs 30000
   ```

2. **Prometheus Setup**

   Use `prometheus.yml` to configure Prometheus to scrape the `/metrics` endpoint.

3. **Grafana Dashboard**

   Import `grafana-dashboard.json` into Grafana to visualize metrics.

4. **Datadog Integration**

   Use `datadog-docker-agent.yaml` to configure Datadog agent with Prometheus scraping.

5. **ELK Stack Setup**

   Follow `elk-metricbeat-filebeat-setup.md` to configure Metricbeat and Filebeat for logs and metrics.

6. **Testing**

   Use `extended-test-script.js` and follow `extended-test-plan.md` for thorough testing.

## Notes

- Update Kafka broker address in `simulate-kafka-lag.js` as per your environment.
- Ensure all services (Kafka, Prometheus, Grafana, Datadog, ELK) are properly configured and running.
- Contact the maintainer for any issues or questions.

---
