-- SQL script to create hl7_records and fhir_records tables

CREATE TABLE IF NOT EXISTS hl7_records (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  parsed_data JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fhir_records (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
