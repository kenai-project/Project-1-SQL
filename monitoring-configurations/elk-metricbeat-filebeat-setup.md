# ELK Stack Metricbeat and Filebeat Setup Guide

This document provides instructions to configure Metricbeat and Filebeat to collect metrics and logs from your application and forward them to Elasticsearch/Logstash for visualization in Kibana.

## Metricbeat Configuration

1. Install Metricbeat on your host or container.

2. Configure Metricbeat to scrape Prometheus metrics from your Node.js app:

```yaml
metricbeat.modules:
- module: prometheus
  period: 15s
  hosts: ["http://localhost:3000"]
  metrics_path: /metrics
  namespace: "nodejs_app"
```

3. Configure output to Elasticsearch or Logstash as per your environment.

## Filebeat Configuration

1. Install Filebeat on your host or container.

2. Configure Filebeat to collect application logs:

```yaml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/your-app/*.log
```

3. Configure output to Elasticsearch or Logstash.

## Deployment

- Start Metricbeat and Filebeat services.

- Verify data ingestion in Kibana dashboards.

## Troubleshooting

- Check Metricbeat and Filebeat logs for errors.

- Ensure network connectivity to Elasticsearch/Logstash.

- Validate Prometheus metrics endpoint accessibility.

## References

- [Metricbeat Prometheus Module](https://www.elastic.co/guide/en/beats/metricbeat/current/metricbeat-module-prometheus.html)

- [Filebeat Configuration](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-configuration.html)
