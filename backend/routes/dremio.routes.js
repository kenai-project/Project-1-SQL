const express = require('express');
const router = express.Router();
const dremioController = require('../controllers/dremio.controller');

router.post('/query', (req, res) => dremioController.runQuery(req, res));

module.exports = router;
