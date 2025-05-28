const cron = require('node-cron');
const kafkaService = require('../services/kafka.service');

const tablesToSync = [
  {
    tableName: 'your_table_name', // Replace with your PostgreSQL table name
    incrementalColumn: 'updated_at', // Replace with your incremental column
    lastValue: '1970-01-01T00:00:00Z', // Initial last sync timestamp
  },
  // Add more tables as needed
];

// Function to update lastValue after each sync
async function syncTable(table) {
  try {
    const count = await kafkaService.produceIncrementalData(
      table.tableName,
      table.incrementalColumn,
      table.lastValue
    );
    console.log(`Synced ${count} records from ${table.tableName}`);
    // Update lastValue to current timestamp or max incrementalColumn value
    // For simplicity, update to now
    table.lastValue = new Date().toISOString();
  } catch (error) {
    console.error(`Error syncing table ${table.tableName}:`, error.message);
  }
}

// Schedule the sync to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Starting incremental data sync...');
  for (const table of tablesToSync) {
    await syncTable(table);
  }
  console.log('Incremental data sync completed.');
});
