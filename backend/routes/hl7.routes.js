const express = require('express');
const router = express.Router();
const { parseHL7, getHL7Patients, deleteHL7Patient } = require('../controllers/hl7.controller');

router.post('/parse-hl7', parseHL7);
router.get('/patients', getHL7Patients);
router.delete('/patients/:id', deleteHL7Patient);

module.exports = router;
