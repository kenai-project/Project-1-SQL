const cron = require('node-cron');
const kafkaService = require('../services/kafka.service');

const tablesToSync = [
  { tableName: 'hl7_records', incrementalColumn: 'created_at', lastValue: new Date(0).toISOString() },
  { tableName: 'fhir_records', incrementalColumn: 'updated_at', lastValue: new Date(0).toISOString() },
];

let cronTask;

async function syncTable(table) {
  try {
    const count = await kafkaService.produceIncrementalData(
      table.tableName,
      table.incrementalColumn,
      table.lastValue
    );
    console.log(`Synced ${count} records from ${table.tableName}`);
    // Update lastValue to current timestamp or max incrementalColumn value
    // For simplicity update to now
    table.lastValue = new Date().toISOString();
  } catch (error) {
    console.error(`Error syncing table ${table.tableName}:`, error.message);
  }
}

function startCron() {
  if (!cronTask) {
    cronTask = cron.schedule('*/5 * * * *', async () => {
      console.log('Starting incremental data sync...');
      for (const table of tablesToSync) {
        await syncTable(table);
      }
      console.log('Incremental data sync completed.');
    });
  }
}

function stopCron() {
  if (cronTask) {
    cronTask.stop();
    cronTask = null;
  }
}

startCron();

module.exports = {
  startCron,
  stopCron,
};
