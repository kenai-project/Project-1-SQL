# Extended Monitoring Test Plan

This document outlines the comprehensive test plan for validating the monitoring implementation including Prometheus metrics scraping, Kafka lag simulation, Debezium connector health, PostgreSQL metrics, and alerting/logging integration.

## Test Areas

### 1. /metrics Endpoint Validation
- Verify endpoint is reachable and returns HTTP 200.
- Confirm content-type is `text/plain`.
- Check presence of key metrics:
  - kafka_ingestion_lag
  - kafka_message_throughput_total
  - kafka_connect_connector_health
  - kafka_connect_error_rate
  - postgres_query_duration_seconds
  - postgres_error_rate_total

### 2. Kafka Lag Simulation
- Use `simulate-kafka-lag.js` to pause Kafka consumer.
- Observe increase in `kafka_ingestion_lag` metric.
- Validate metric updates at scrape intervals.

### 3. Debezium Connector Health
- Use REST API to pause/fail Debezium connector.
- Confirm `kafka_connect_connector_health` metric reflects state.
- Validate error rate metrics update accordingly.

### 4. PostgreSQL Metrics
- Simulate slow queries using `pg_sleep`.
- Induce query errors.
- Validate histogram and error rate metrics update.
- Confirm metrics reflect query durations and error counts.

### 5. Alerting and Logging
- Inject application errors or metric anomalies.
- Verify alerts trigger in Datadog and ELK stack.
- Confirm logs are forwarded and searchable.

### 6. Regression Testing
- Confirm legacy monitoring endpoints (`/kafka-lag`, `/spark-job-status`, `/spark-job-failures`) function correctly.
- Validate no performance regressions or errors introduced.

## Execution

- Run automated test scripts where available.
- Perform manual tests for connector state changes and query delays.
- Monitor logs and alert dashboards during tests.

## Reporting

- Document any failures or anomalies.
- Provide logs and screenshots for issues.
- Recommend fixes or improvements as needed.

## Notes

- Coordinate with DevOps for environment setup.
- Ensure Prometheus, Grafana, Datadog, and ELK stack are properly configured before testing.
