-- Spark SQL script to consume Kafka topic and write to Iceberg table

CREATE TABLE IF NOT EXISTS your_iceberg_db.your_table_name (
  id INT,
  name STRING,
  updated_at TIMESTAMP,
  -- Add other columns matching your PostgreSQL schema
)
USING iceberg;

CREATE OR REPLACE TEMPORARY VIEW kafka_source AS
SELECT CAST(value AS STRING) AS json_str
FROM kafka.`your_table_name-update`
OPTIONS (
  'kafka.bootstrap.servers' = 'localhost:9092',
  'startingOffsets' = 'earliest'
);

-- Parse JSON and select fields
CREATE OR REPLACE TEMPORARY VIEW parsed_data AS
SELECT
  get_json_object(json_str, '$.id') AS id,
  get_json_object(json_str, '$.name') AS name,
  CAST(get_json_object(json_str, '$.updated_at') AS TIMESTAMP) AS updated_at
FROM kafka_source;

-- Write streaming data to Iceberg table
INSERT INTO your_iceberg_db.your_table_name
SELECT * FROM parsed_data;
