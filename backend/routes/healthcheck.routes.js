const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/healthcheck/mongodb', async (req, res) => {
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  let status = 'unknown';
  switch(state) {
    case 0:
      status = 'disconnected';
      break;
    case 1:
      status = 'connected';
      break;
    case 2:
      status = 'connecting';
      break;
    case 3:
      status = 'disconnecting';
      break;
    default:
      status = 'unknown';
  }
  res.json({ mongodbConnectionState: status });
});

module.exports = router;
